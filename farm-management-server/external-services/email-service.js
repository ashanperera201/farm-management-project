const nodemailer = require("nodemailer");
require('dotenv').config({ path: `./env-${process.env.NODE_ENV}.env` })


const environmentConfigs = process.env;

exports.sendEmail = async ({ name, email, userName, otherUserName, subject }, password) => {
    try {

        if (email) {
            let transporter = nodemailer.createTransport({
                host: environmentConfigs.emailHost,
                auth: {
                    user: environmentConfigs.email,
                    pass: environmentConfigs.password,
                },
            });

            let info = await transporter.sendMail({
                from: environmentConfigs.email,
                to: email,
                subject: subject,
                text: `Hi ${name}, \n Account is created, please find your credentials below . 
                                   \n User name : ${userName} ${otherUserName ? `/ Other User name : ${otherUserName}` : ``} \n password : ${password}`
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            return true;
        } else {
            console.log("Specified user needs to have an email.");
            return false;
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

