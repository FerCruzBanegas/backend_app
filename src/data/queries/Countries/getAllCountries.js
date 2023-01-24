import {Country} from '../../../data/models';
import CountryData from '../../types/getCountryType';

const getAllCountries = {

    type: CountryData,

    async resolve({request}) {
        try {
            const results = await Country.findAll();
            
            return {
                results: results && results.length > 0 ? results : [],
                status: results && results.length > 0 ? 200 : 400,
                errorMessage: results && results.length > 0 ? null : 'No records found.'
            }
            
        } catch(error){
            return {
                errorMessage: 'Oops! Something went wrong! ' + error,
                status: 400
            };
        }

    }
};

export default getAllCountries;
