import { OrderItems } from '../../../models';

export async function checkAllowableServices(orderId, allowedServices) {
    try {
        const count = await OrderItems.count({
            where: {
                orderId
            }
        });
        return await {
            serviceStatus: (count > allowedServices) ? 400 : 200,
            serviceErrorMessage: (count > allowedServices) ? `Oops! Maximum ${allowedServices} services is allowed for a booking so kindly make another service request separately.` : null
        }
    } catch (error) {
        return {
            serviceStatus: 400,
            serviceErrorMessage: "Something went wronng"
        };
    }
}