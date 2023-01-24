import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType,
  GraphQLList as List
} from 'graphql';
import { UserProfile, SiteSettings, UserCategory } from '../models';

import UserEditProfile from './userEditProfileType';
import SiteSettingsType from './SiteSettingsType';
import { url, toneUploadDir } from '../../config';

const UserType = new ObjectType({
  name: 'UserType',
  fields: {
    id: { type: new NonNull(ID) },
    email: { type: StringType },
    emailConfirmed: { type: BooleanType },
    type: { type: StringType },
    userBanStatus: { type: IntType },
    status: { type: IntType },
    errorMessage: { type: StringType },
    userId: { type: StringType },
    userToken: { type: StringType },
    forgotLink: { type: StringType },
    firstName: { type: StringType },
    lastName: { type: StringType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    phoneNumber: { type: StringType },
    userStatus: { type: StringType },
    activeStatus: { type: StringType },
    isActive: { type: IntType },
    orderId: { type: IntType },
    phoneCountryCode: { type: StringType },
    phoneDialCode: { type: StringType },
    overallRating: { type: FloatType },
    deviceId: { type: StringType },
    deviceType: { type: StringType },
    userType: { type: StringType },
    experienceDescription: {
      type: StringType,
    },
    address: { type: StringType },
    user: {
      type: UserEditProfile,
      async resolve(user) {
        return await UserProfile.findOne({
          where: {
            userId: user.userId
          }
        })
      }
    },
    siteSettings: {
      type: new List(SiteSettingsType),
      async resolve(userProfile) {
        return await SiteSettings.findAll({
          attributes: ['name', 'value'],
          where: {
            name: {
              $in: ['allowableDistace', 'allowedServices', 'notificationInterval', 'sleepPartnerAndroid',
                'sleepPartnerios', 'contactPhoneNumber', 'contactEmail', 'skype', 'maximumEmergencyContact', 'duration', 'job', 'photo', 'description', 'location', 'estimatedPrice', 'siteName', 'homeLogo', 'defaultScheduleInterval', 'requestToneFile', 'openAppOnRequest', 'isRequestTimerToneEnable']
            }
          }
        });
      }
    },

    requestTone: {
      type: StringType,
      async resolve(userProfile) {
        let result = await SiteSettings.findOne({
          attributes: ['name', 'value'],
          where: {
            name: 'requestTimeTone'
          }
        });
        let directory = toneUploadDir.replace(".", "");
        let data = result.value ? (url + directory + result.value) : null
        return data;
      }
    },
    isCategoryUsed: {
      type: BooleanType,
      async resolve(userProfile, { }, request) {
        let userCategory = await UserCategory.findOne({
          attributes: ['id', 'userId'],
          where: {
            userId: request.user.id,
          },
          raw: true
        });
        return (userCategory ? true : false)
      }
    },
  },
});

export default UserType;
