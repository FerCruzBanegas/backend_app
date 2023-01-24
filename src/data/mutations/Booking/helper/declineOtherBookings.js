import moment from 'moment';
import { sendNotifications } from "../../../../helpers/push-notification/sendNotifications";
import sendSocketNotification from "../../../../helpers/socketNotification/sendSocketNotification";
import { Booking, BookingHistory, BookingReviewImage, OrderItems, Orders, SiteSettings, SubCategory, User } from "../../../models";
import findNearestPartner from '../../../../helpers/findNearestPartner';
import { getUserProfileData } from '../../../../helpers/booking/commonHelpers';

export default async function (partnerId, currentBookingId) {

    try {
        const partnersOtherBookings = await Booking.findAll({
            attributes: [
                "userLocationLat",
                "userLocationLng",
                "userLocation",
                "categoryId",
                "partnerId",
                "userId",
                "id",
                "reviewDescription",
                "orderId",
                "estimatedTotalFare"
            ],
            where: { partnerId, status: 'created', id: { $ne: currentBookingId } }, raw: true
        });

        if (Array.isArray(partnersOtherBookings) && partnersOtherBookings.length > 0) {
            await Promise.all(partnersOtherBookings.map(async function (bookingData) {
                if (!bookingData) return { status: 400 };

                let categoryId, nextpartnerId, userId, requestLang, bookingId;
                let userLocationLat, userLocationLng, userLocation;
                userLocationLat = bookingData.userLocationLat;
                userLocationLng = bookingData.userLocationLng;
                userLocation = bookingData.userLocation;
                categoryId = bookingData.categoryId;
                nextpartnerId = bookingData.partnerId;
                userId = bookingData.userId;
                bookingId = bookingData.id;

                let requestProfileParams = ['preferredLanguage', 'preferredCurrency', 'address', 'lat', 'lng',
                    'preferredLocation', 'preferredLat', 'preferredLng', 'firstName', 'picture', 'lastName'];

                const userProfileData = await getUserProfileData(userId, requestProfileParams);

                let partnerProfileData = await getUserProfileData(nextpartnerId, requestProfileParams);

                // Update Booking History for Partner Decline history
                await BookingHistory.create({
                    status: 'declined',
                    bookingId,
                    partnerId: nextpartnerId,
                    userId
                });

                // Enable the declined partner availability for another booking
                await User.update({
                    activeStatus: 'inactive'
                }, {
                    where: {
                        id: nextpartnerId
                    }
                });

                const getSiteSettings = await SiteSettings.findOne({
                    attributes: ['name', 'value'],
                    where: {
                        name: 'allowableDistace'
                    },
                    raw: true
                });

                let orderItemDetails = await OrderItems.findAll({
                    attributes: ['subCategoryId', 'totalQuantity'],
                    where: {
                        orderId: bookingData.orderId,
                    },
                    raw: true
                });

                let subCategoryId = orderItemDetails && orderItemDetails.length > 0 && orderItemDetails.map((item) => item.subCategoryId);

                const nearestPartner = await findNearestPartner(userLocationLat, userLocationLng, userId, getSiteSettings.value, subCategoryId);

                if (nearestPartner && nearestPartner.status === 200 && nearestPartner.result) {

                    nextpartnerId = nearestPartner.result.id;

                    partnerProfileData = await getUserProfileData(nextpartnerId, requestProfileParams);

                    requestLang = partnerProfileData && partnerProfileData.preferredLanguage;

                    // Update the booking with new Partner
                    await Booking.update({
                        partnerId: nextpartnerId
                    }, {
                        where: {
                            id: bookingId
                        }
                    });

                    // Create Booking History for New Partner
                    await BookingHistory.create({
                        bookingId,
                        userId,
                        partnerId: nextpartnerId,
                        status: 'approved'
                    });

                    // Disable the chosen partner availability for another trip
                    await User.update({
                        activeStatus: 'active'
                    }, {
                        where: {
                            id: nextpartnerId
                        }
                    });

                    let reviewImage = await BookingReviewImage.findAll({
                        where: { orderId: bookingData.orderId },
                        raw: true
                    });

                    let jobList = [];
                    jobList = await Promise.all(orderItemDetails && orderItemDetails.length > 0 && orderItemDetails.map(async (item) => {
                        let data = await SubCategory.findOne({
                            attributes: ['name'],
                            where: {
                                id: item.subCategoryId
                            }
                        });

                        return {
                            totalQuantity: item.totalQuantity,
                            name: data.name
                        }
                    }));

                    let content = {
                        userId,
                        partnerId: nextpartnerId,
                        userDetails: {
                            name: userProfileData.firstName,
                            picture: userProfileData.picture,
                            phoneNumber: userProfileData['user.phoneDialCode'] + '' + userProfileData['user.phoneNumber'],
                            overallRating: userProfileData['user.overallRating'],
                        },
                        partnerDetails: {
                            name: partnerProfileData.firstName,
                            picture: partnerProfileData.picture,
                            phoneNumber: partnerProfileData['user.phoneDialCode'] + '' + partnerProfileData['user.phoneNumber'],
                            overallRating: partnerProfileData['user.overallRating'],
                        },
                        bookingId,
                        userLocation: bookingData.userLocation,
                        userLocationLat: bookingData.userLocationLat,
                        userLocationLng: bookingData.userLocationLng,
                        reviewDescription: bookingData.reviewDescription,
                        reviewImage,
                        estimatedTotalFare: bookingData.estimatedTotalFare,
                        jobList,
                        bookingStatus: 'created',
                        updatedAt: moment().utc().unix()
                    };

                    sendSocketNotification('serviceRequest-' + nextpartnerId, content);

                    sendNotifications({ type: 'serviceRequest', requestContent: content, userId: nextpartnerId, lang: requestLang, userType: 2 });


                } else {
                    // Update Booking to Expired
                    const findPendingPartners = await Booking.findAll({
                        attributes: ['partnerId'],
                        where: {
                            id: bookingId
                        },
                        raw: true
                    });

                    const pendingPartnerIds = findPendingPartners && findPendingPartners.map(o => o.partnerId);

                    if (pendingPartnerIds && pendingPartnerIds.length > 0) {

                        await User.update({
                            activeStatus: 'inactive'
                        }, {
                            where: {
                                id: {
                                    $in: pendingPartnerIds
                                }
                            }
                        });
                    }

                    await Booking.update({
                        status: 'expired',
                        notes: 'Decline - No partners found.'
                    }, {
                        where: {
                            id: bookingId
                        }
                    });

                    await Orders.update({
                        status: 'cancelled'
                    }, {
                        where: {
                            id: bookingData.orderId
                        }
                    });

                    let content = {
                        userId,
                        userDetails: {
                            name: userProfileData.firstName,
                            picture: userProfileData.picture,
                            phoneNumber: userProfileData['user.phoneDialCode'] + '' + userProfileData['user.phoneNumber'],
                            overallRating: userProfileData['user.overallRating'],
                        },
                        partnerDetails: {
                            name: partnerProfileData.firstName,
                            picture: partnerProfileData.picture,
                            phoneNumber: partnerProfileData['user.phoneDialCode'] + '' + partnerProfileData['user.phoneNumber'],
                            overallRating: partnerProfileData['user.overallRating'],
                        },
                        bookingId,
                        bookingStatus: 'declined'
                    };

                    requestLang = userProfileData && userProfileData.preferredLanguage;

                    sendSocketNotification('serviceDeclined-' + bookingId, content);
                    sendNotifications({ type: 'serviceDeclined', requestContent: content, userId, lang: requestLang, userType: 1 });


                }
            }));
        }

        return { status: 200 };
    } catch (error) {
        return { status: 400, errorMessage: error.message };
    }
}