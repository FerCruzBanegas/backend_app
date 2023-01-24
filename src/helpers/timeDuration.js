import moment from 'moment';

export function getMinutes(startDate, endDate) {
    if (startDate && endDate) {
        let totalDuration = ((moment.utc(endDate).diff(startDate, 'seconds')) / 60);
        return (totalDuration);
    } else {
        return 0;
    }
}