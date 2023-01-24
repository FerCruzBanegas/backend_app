// Fetch request
import fetch from 'node-fetch';
import { websiteUrl } from '../config';

export async function sendEmail(to, type, mailContents) {

    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    const resp = await fetch(websiteUrl + '/sendEmailTemplate', {
        method: 'post',
        headers,
        body: JSON.stringify({
            to,
            type,
            content: mailContents
        })
    });

    const { status, errorMessge } = resp.json;

    return await {
        status,
        errorMessge
    };
}

export default {
    sendEmail
}
