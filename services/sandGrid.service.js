const sgMail = require('@sendgrid/mail');
const config = require('../config');
const constant = require('../constants/constant');

sgMail.setApiKey(config.SENDGRID_API_KEY);

module.exports = {
  mailOptions(to, subject, html) {
    return {
      from: `"${constant.website_info.custodialWallet}" <${config.EMAIL_SENDER}>`,
      to: to,
      subject: subject,
      html: html,
    };
  },

  sendMail(to, subject, html) {
    return new Promise((resolve, reject) => {
      const options = this.mailOptions(to, subject, html);

      sgMail.send(options)
        .then((info) => {
          console.log('Email sent successfully:', info);
          resolve(info);
        })
        .catch((error) => {
          console.error('Error sending email:', error.response.body);
          reject(error);
        });
    });
  },
};
