import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType,
  GraphQLList as List
} from 'graphql';

const BookingResponseType = new ObjectType({
  name: 'BookingResponseType',
  fields: {
    id: {
      type: StringType
    },
    name: {
      type: StringType
    },
    userId: {
      type: StringType
    },
    partnerId: {
      type: StringType
    },
    picture: {
      type: StringType
    },
    phoneNumber: {
      type: StringType
    },
    userLocation: {
      type: StringType
    },
    userLocationLat: {
      type: FloatType
    },
    userLocationLng: {
      type: FloatType
    },
    partnerLocation: {
      type: StringType
    },
    partnerLocationLat: {
      type: FloatType
    },
    partnerLocationLng: {
      type: FloatType
    },
    startLocation: {
      type: StringType
    },
    startLat: {
      type: FloatType
    },
    startLng: {
      type: FloatType
    },
    bookingId: {
      type: IntType
    },
    categoryId: {
      type: IntType
    },
    overallRating: {
      type: FloatType
    },
    locationUpdate: {
      type: BooleanType
    },
    status: {
      type: StringType
    },
    totalRideDistance: {
      type: FloatType
    },
    userServiceFee: {
      type: FloatType
    },
    partnerServiceFee: {
      type: FloatType
    },
    estimatedTotalFare: {
      type: FloatType
    },
    totalFare: {
      type: FloatType
    },
    currency: {
      type: StringType
    },
    userTotalFare: {
      type: FloatType
    },
    partnerTotalFare: {
      type: FloatType
    },
    notes: {
      type: StringType
    },
    paymentType: {
      type: IntType
    },
    walletBalance: {
      type: FloatType
    },
    promoCodeId: {
      type: IntType
    },
    isSpecialService: {
      type: BooleanType
    },
    specialServiceFare: {
      type: FloatType
    },
    specialServiceTotalFare: {
      type: FloatType
    },
    reason: {
      type: StringType
    },
    travellingPrice: {
      type: FloatType
    },
    userPayableFare: {
      type: FloatType
    },
    discountAmount: {
      type: FloatType
    },
    travellingPrice: {
      type: FloatType
    },
    additionalFee: {
      type: FloatType
    },
    isTipGiven: {
      type: BooleanType
    },
    tipsAmount: {
      type: FloatType
    },
    tipsTotalFare: {
      type: FloatType
    },
    tipsPartnerTotalFare: {
      type: FloatType
    },
    bookingType: {
      type: IntType
    },
  }
});


const BookingRequestType = new ObjectType({
  name: 'BookingRequestType',
  fields: {
    errorMessage: { type: StringType },
    status: { type: IntType },
    result: { type: BookingResponseType },
    isTryAgain: {
      type: BooleanType,
      resolve(responseData) {
        return responseData.isTryAgain || false;
      }
    }
  },
});

export default BookingRequestType;