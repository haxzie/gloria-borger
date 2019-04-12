const nodemailer = require('nodemailer');
const smptpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smptpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
}));

module.exports = async function(context, emails, subject, contents, recipientName) {
    let mailOptions = {
        from: process.env.FROM_EMAIL,
        to: emails,
        subject: subject,
        html: contents,
    };

    transporter.sendMail(mailOptions, async function(error, info) {
        // something went wrong while sending the emails!
        if (error) {
            return await context.github.issues.createComment(context.issue({
                body: "Ooops! Something went wrong. I wasn't able to send the emails. ```"+error+"``` "
            }));
        } else {
            return await context.github.issues.createComment(context.issue({
                body: `Email has been successfully sent to ${recipientName}`,
            }));
        }
    });
}