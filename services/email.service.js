const nodeMailer = require('nodemailer')
const config = require('../config')
const constant = require('../constants/constant')

module.exports = {
  mailOptions(to, subject, html) {
    return {
      from: `"${constant.website_info.custodialWallet}" <${config.EMAIL_SENDER}>`,// config.EMAIL_SENDER,
      to: to,
      subject: subject,
      html: html,
    };
  },

  sendMail(to, subject, html) {

    return new Promise((resolve, reject) => {
      const options = this.mailOptions(to, subject, html);
      this.transporter.sendMail(options, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          reject(error);
        } else {
          console.log('Email sent successfully:', info.response);
          resolve(info);


        }
      });
    });
  },

  transporter: nodeMailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    service: config.EMAIL_HOST,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
  }),
};


