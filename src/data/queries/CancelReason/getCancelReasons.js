import {
	GraphQLInt as IntType
} from 'graphql';
import { CancelReason } from '../../models';

import CancelReasonListType from '../../types/CancelReasonListType';

const getCancelReasons = {

	type: CancelReasonListType,

	args: {
		userType: { type: IntType }
	},

	async resolve({ request }, { userType }) {
		try {

			let results = await CancelReason.findAll({
				where: {
					$and: [
						{ userType }
					]
				},
				raw: true,
			});

			return await {
				status: 200,
				results
			};
		}
		catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}
	},
};

export default getCancelReasons;

/*
			  
query {
		getCancelReasons {
				status
				errorMessage
				results {
					id
					reason
					reasonto
				}
		}
}

*/
