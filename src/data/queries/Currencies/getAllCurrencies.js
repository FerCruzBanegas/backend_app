import Currencies from '../../models/Currencies';
import CurrenciesData from '../../types/getCurrenciesType';  

const getAllCurrencies = {

    type: CurrenciesData,

    async resolve ({ request }) {
        try {
            const results = await Currencies.findAll({
                where: {
                    isEnable: true
                }
            }); 

            return {
                results: results && results.length > 0 ? results : [],
                status: results && results.length > 0 ? 200 : 400,
                errorMessage: results && results.length > 0 ? null : 'No records found.'
            }

        } catch(error) {
            return {
                errorMessage: 'Oops! Something went wrong! ' + error,
                status: 400
            };
        }
    }
};

export default getAllCurrencies;

/*

query {
  getAllCurrencies {
    results {
      id
      symbol
      isEnable
      isPayment
      isPayment
      isBaseCurrency
    }
    status
    errorMessage
  }
}

*/