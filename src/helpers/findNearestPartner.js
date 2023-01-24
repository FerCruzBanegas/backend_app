import sequelize from '../data/sequelize';

export default async function findNearestPartner(latVal, lngVal, userId, distance, subCategoryId) {



    const result = await sequelize.query(`
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
                            ORDER BY distance ASC LIMIT 1
                        `, {
        type: sequelize.QueryTypes.SELECT
    });

    if (result && result.length > 0) {
        return await {
            result: result[0],
            status: 200
        }
    } else {
        return await {
            status: 400,
            errorMessage: 'Sorry, no delivery service provider found.'
        }
    }


}