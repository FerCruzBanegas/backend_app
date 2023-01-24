import {
    GraphQLInt as IntType,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { SiteSettings, HomePage } from '../../models';
import CommonType from '../../types/CommonType';

import { versionCompare } from '../../../helpers/formatNumbers';
import { pushNotificationMessage } from '../../../helpers/push-notification/pushNotificationMessage';
import checkUserBanStatus from '../../../helpers/userLogin/checkUserBanStatus';

const getApplicationVersionInfo = {

    type: CommonType,

    args: {
        osType: { type: new NonNull(StringType) },
        appType: { type: new NonNull(IntType) },
        version: { type: new NonNull(StringType) },
        requestLang: { type: StringType }
    },

    async resolve({ request }, { osType, appType, version, requestLang }) {
        try {

            if (request && request.user) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
            }

            let requestAppName, status = 200, errorMessage, appForceUpdate, appVersion, appVersionCompare, appStoreUser, appStoreDriver, playStoreUser, playStoreDriver;
            requestAppName = appType === 2 ? 'partner' : 'user';
            requestAppName = requestAppName + (osType === 'ios' ? 'Ios' : 'Android') + 'Version';

            const getSiteSettings = await SiteSettings.findAll({
                attributes: ['name', 'value'],
                where: {
                    name: {
                        $in: ['appForceUpdate', requestAppName]
                    }
                },
                raw: true
            });

            const getHomeSettings = await HomePage.findAll({
                attributes: ['name', 'value'],
                where: {
                    name: {
                        $in: ['signupGridLink1', 'signupGridLink2', 'safetyGridLink1', 'safetyGridLink2']
                    }
                },
                raw: true
            });


            appForceUpdate = getSiteSettings && getSiteSettings.find((o) => o.name === 'appForceUpdate').value;
            appVersion = getSiteSettings && getSiteSettings.find((o) => o.name !== 'appForceUpdate').value;
            appStoreUser = getHomeSettings && getHomeSettings.find((o) => o.name === 'safetyGridLink2').value;
            appStoreDriver = getHomeSettings && getHomeSettings.find((o) => o.name === 'signupGridLink2').value;
            playStoreUser = getHomeSettings && getHomeSettings.find((o) => o.name === 'safetyGridLink1').value;
            playStoreDriver = getHomeSettings && getHomeSettings.find((o) => o.name === 'signupGridLink1').value;

            appVersionCompare = versionCompare(version, appVersion);

            if (appForceUpdate === 'true' && appVersionCompare && appVersionCompare.forceUpdate) {
                status = 400;
                errorMessage = (await pushNotificationMessage('forceUpdate', null, requestLang)).message;
            }

            return await {
                status,
                errorMessage,
                result: {
                    appStoreURL: {
                        user: appStoreUser,
                        driver: appStoreDriver,
                    },
                    playStoreURL: {
                        user: playStoreUser,
                        driver: playStoreDriver,
                    }
                }
            };
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong! ' + error
            }
        }
    }
};

export default getApplicationVersionInfo;

/*

query ($osType: String!, $appType: Int!, $version: String!, $requestLang: String) {
    getApplicationVersionInfo(osType: $osType, appType: $appType, version: $version, requestLang: $requestLang) {
        status
        errorMessage
    }
}

*/