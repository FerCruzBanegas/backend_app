import {
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull,
} from 'graphql';
import { Payout } from '../../models';
import PayoutType from '../../types/PayoutType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';


const setDefaultPayout = {

	type: PayoutType,

	args: {
		id: { type: new NonNull(IntType) },
		type: { type: new NonNull(StringType) },
	},

	async resolve({ request }, {
		id,
		type
	}) {

		try {

			if (request.user) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

				let userId = request.user.id;
				if (type == 'set') {

					let changeEverything = await Payout.update({
						isDefault: false
					},
						{
							where: {
								userId
							}
						});

					let payoutupdated = await Payout.update({
						isDefault: true
					},
						{
							where: {
								id,
								userId
							}
						});
					return {
						status: payoutupdated ? 200 : 400,
						errorMessage: payoutupdated ? null : 'Oops! Something went wrong'
					}

				} else if (type == "remove") {
					let payoutRemoved = await Payout.destroy({
						where: {
							id,
							userId
						}
					});

					return {
						status: payoutRemoved ? 200 : 400,
						errorMessage: payoutRemoved ? null : 'Oops! Something went wrong'
					}

				} else {
					return {
						status: 400,
						errorMessage: 'Please send correct type name.',
					};
				}

			} else {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.',
				};
			}
		} catch (error) {
			return {
				status: 400,
				errorMessage: 'Oops! Something went wrong! ' + error.message

			}
		}
	},
};

export default setDefaultPayout;

/**
mutation setDefaultPayout($id: Int!, $type: String!) {
		setDefaultPayout(id: $id, type: $type) {
				status
		}
}
 */
