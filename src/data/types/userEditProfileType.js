import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const UserEditProfile = new ObjectType({
  name: 'userEditProfile',
  fields: {
    userId: { type: ID },
    firstName: { type: StringType },
    lastName: { type: StringType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    email: { type: StringType },
    phoneNumber: { type: StringType },
    phoneDialCode: { type: StringType },
    preferredLanguage: { type: StringType },
    preferredCurrency: { type: StringType },
    location: { type: StringType },
    info: { type: StringType },
    status: { type: StringType },
    country: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    zipcode: { type: StringType },
    verificationCode: { type: IntType },
    licenceFront: { type: StringType },
    licenceBack: { type: StringType },
    profileId: { type: IntType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    overallRating: { type: FloatType },
    phoneCountryCode: { type: StringType },
    walletUsed: { type: FloatType },
    walletBalance: { type: FloatType },
    picture: { type: StringType },
    createdAt: { type: StringType },
    displayName: { type: StringType },
    countryCode: { type: StringType },
    preferredPaymentMethod: { type: IntType },
    experienceDescription: { type: StringType },
    preferredLat: { type: FloatType },
    preferredLng: { type: FloatType },
    preferredLocation: { type: StringType },
    address: { type: StringType },
    preferredType: { type: StringType },
    isDocumentUploaded: {
      type: BooleanType
    },
    cardLastFour: {
      type: IntType,
    },
  },
});

export default UserEditProfile;
