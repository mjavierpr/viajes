const Hbs = require('nodemailer-express-handlebars');
const Path = require('path');

let nodeMailer = require('nodemailer');
let email = {};
const handlebarOptions = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: 'views/email-templates/partials',
        layoutsDir: 'views/email-templates/layouts',
        defaultLayout: 'email.body.hbs',
    },
    viewPath: Path.join(__dirname, '/../views/email-templates'),
    extName: '.hbs',
};
let logInfo = {
    service: 'Gmail',
    auth: {
        user: 'myemail@gmail.com',
        pass: 'mypassword'
    },
    tls: {rejectUnauthorized: false},
}
let emailInfo = {
    from: 'myemail@gmail.com',
    headers: {}
}
email.transporter = nodeMailer.createTransport(logInfo, emailInfo);
email.transporter.use('compile', Hbs(handlebarOptions));

module.exports = email;
