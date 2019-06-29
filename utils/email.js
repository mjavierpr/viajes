const moment = require('moment');
const Email = require('../config/email');

async function sendEmail (email, template, subject, text, link) {
    let message = {
        to: email,
        subject: subject,
        template: template,
        context: {
            email: email,
            text: text,
            link: link
        },
        // html: body
    }
    let msg = await Email.transporter.sendMail(message);
    return msg ? 'ok' : null;
}

function generateKeylink() {
    let keyLink = moment().format('YYYYMMDDhhmmss') + Date.now();
    return keyLink;
}
 
module.exports = {
    sendEmail,
    generateKeylink
}
