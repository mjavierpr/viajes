const moment = require('moment');
const Email = require('../config/email');

function sendMail (email, template, subject, text, link) {
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
    Email.transporter.sendMail(message, (error, info) => {
        if (error) {
            return res.status(500).send(error);
        } else {
            Email.transporter.close();
            // console.log('Respuesta "%s"', info.response);
            res.status(200).send('Respuesta "%s"', info.response);
        }
    });
}

function generateKeylink(user) {
    let keyLink = moment().format('YYYYMMDDhhmmss') + Date.now();
    return keyLink;
}
 
module.exports = {
    sendMail,
    generateKeylink
}