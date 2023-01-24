import fetch from 'node-fetch';

import { url } from '../config';

async function addOrder({
    categoryId,
    subCategoryId,
    totalQuantity,
    minimumHours,
    currency,
    userToken
}) {
    let query = `
        mutation addOrder(
            $categoryId: Int!
            $subCategoryId: Int!
            $totalQuantity: Int
            $currency: String!
            $minimumHours: Float
        ) {
            addOrder(
                categoryId: $categoryId
                subCategoryId: $subCategoryId
                totalQuantity: $totalQuantity
                currency: $currency
                minimumHours: $minimumHours
            ) {
                status
                errorMessage
                result {
                    id
                }
            }
        }
    `;

    let variables = {
        categoryId,
        subCategoryId,
        totalQuantity,
        minimumHours,
        currency,
    };

    const { data, data: { addOrder } } = await new Promise((resolve, reject) => {
        fetch(url + '/graphql', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Auth': userToken
            },
            body: JSON.stringify({ query, variables }),
            method: 'post',
        }).then(res => res.json())
            .then(function (body) {
                if (body) {
                    resolve(body)
                } else {
                    reject(error)
                }
            });
    });

    if (data && addOrder) {
        return await addOrder;
    }

}

export default addOrder;