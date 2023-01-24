import moment from 'moment';
import sequelize from '../../data/sequelize';
import {
    Location,
    Pricing,
    PromoCode,
    BookingHistory
} from '../../data/models';


// Check the pick up location in eligible to ride and find the permission geo locations IDs
const findPermittedLocation = async (pickUpLat, pickUpLng) => {
    try {
        // let requestLocationPoint, contains, permittedLocationsId;
        let requestLocationPoint, contains, permittedLocationsId = [];

        requestLocationPoint = sequelize.fn('ST_GeomFromText', `POINT(${pickUpLat} ${pickUpLng})`);

        contains = sequelize.fn('ST_CONTAINS',
            sequelize.col(`geometryCoordinates`),
            requestLocationPoint
        );

        const permittedLocations = await Location.findAll({
            attributes: ['id'],
            where: {
                isActive: true,
                and: sequelize.where(contains, 1)
            },
            order: [['id', 'DESC']],
            raw: true
        });

        permittedLocationsId = permittedLocations && permittedLocations.length > 0 && permittedLocations.map(x => { return x['id'] }) || [];

        return await permittedLocationsId;
    } catch (error) {
        console.log('findPermittedLocation Error: ', error);
        return [];
    }
}

// Find the pricing for the allowed location with the request category
const findPricing = async (categoryId, permittedLocationsId, attributes) => {
    try {
        return await Pricing.findAll({
            attributes,
            where: {
                isActive: true,
                locationId: {
                    $in: permittedLocationsId
                },
                categoryId
            },
            order: [
                ['id', 'DESC']
            ],
            raw: true
        });
    } catch (error) {
        console.log('findPricing Error: ', error);
        return null;
    }
}

// Find the promo code by id with the expiry date
const findPromoCodeData = async (id, userId, requestDate) => {
    try {

        return await PromoCode.findOne({
            where: {
                $and: [
                    { id },
                    { isEnable: true },
                    {
                        id: {
                            $notIn: [
                                sequelize.literal(`SELECT promoCodeId FROM Booking WHERE riderId="${userId}" AND isSpecialTrip=1`)
                            ]
                        }
                    },
                    {
                        expiryDate: {
                            $or: [{
                                $gte: moment().format("YYYY-MM-DD")
                            }, {
                                $eq: null
                            }]
                        }
                    }
                ]
            },
            raw: true
        });
    } catch (error) {
        console.log('findPromoCodeData Error: ', error);
        return null;
    }
}


const createBookingHistory = async (bookingId, userId, partnerId) => {
    try {
        return await BookingHistory.create({
            bookingId,
            userId,
            partnerId,
            status: 'created'
        });
    } catch (error) {
        console.log('createBookingHistory Error: ', error);
        return null;
    }
}


const getNearestDrivers = async (latVal, lngVal, userId, distance, subCategoryId, alreadyAssignedPartners) => {
    try {

        let restrictActiveBooking = alreadyAssignedPartners && alreadyAssignedPartners.length > 0 ? `id NOT IN(${alreadyAssignedPartners})` : '1=1';

        return await sequelize.query(`

        SELECT
        id,
        (
          6371 *
          acos(
              cos( radians( ${latVal} ) ) *
              cos( radians( lat ) ) *
              cos(
                  radians( lng ) - radians( ${lngVal} )
              ) +
              sin(radians( ${latVal} )) *
              sin(radians( lat ))
          )
        ) AS distance  FROM 
            User WHERE 
            (
                User.isActive=true
            ) AND (
                User.isBan=false
            ) AND (
                User.userType=2
            ) AND (
                User.userStatus='active'
            ) AND (
                User.activeStatus = "inactive"
            ) AND (    
                User.deletedAt IS NULL
            ) AND (
                User.id IN(SELECT userId FROM UserCategory WHERE subCategoryId IN(${subCategoryId}) GROUP BY userId HAVING COUNT(subCategoryId) = ${subCategoryId.length})    
            ) AND ( 
                User.updatedAt >= "${new Date(Date.now() - 5 * 60000).toISOString().slice(0, 19).replace('T', ' ')}"
            ) AND (
                User.id NOT IN(SELECT partnerId FROM BookingHistory WHERE userId="${userId}" AND status IN('declined', 'cancelledByPartner') AND updatedAt BETWEEN "${new Date(Date.now() - 1 * 60000).toISOString().slice(0, 19).replace('T', ' ')}" AND "${new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')}")
            ) AND (
                User.id != "${userId}"    
            ) AND (
                ${restrictActiveBooking}
            ) AND (
                6371 *
                acos(
                    cos( radians( ${latVal} ) ) *
                    cos( radians( lat ) ) *
                    cos(
                        radians( lng ) - radians( ${lngVal} )
                    ) +
                    sin(radians( ${latVal} )) *
                    sin(radians( lat ))
                )
            ) < ${distance}
            ORDER BY distance ASC LIMIT 5`, {
            type: sequelize.QueryTypes.SELECT
        });
    } catch (error) {
        console.log('getNearestDrivers Error: ', error);
        return null;
    }
}


module.exports = {
    findPermittedLocation,
    findPricing,
    findPromoCodeData,
    createBookingHistory,
    getNearestDrivers
};