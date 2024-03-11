
const constant = require('./constants/constant')
// const dotenv = require("dotenv");
// dotenv.config({ path: `.env` });
module.exports = {

  PORT: process.env.PORT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  SESSION_EXPIRES_IN: "1d",
  otpExpireTime: 20,
  //Email credential
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_SENDER: process.env.EMAIL_SENDER,


  //Sand Grid Email credential
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,

  //DB credential
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  CYPHER_KEY: process.env.CYPHER_KEY,
  PROJECT_ID: process.env.PROJECT_ID,


  
  WS_URI_ETH: process.env.ETH_CON,
  WS_URI_MATIC: process.env.MATIC_CON,
  WS_URI_STELLAR: process.env.STELLAR_CON,

  EMAIL_SUBJECT: {
    LOGIN_EMAIL: "User Login ",
    FORGOT_PASSWORD_EMAIL: "Forgot Password  ",
    FORGOT_USERNAME_EMAIL: "Forgot Username ",
    RESNED_OTP_EMAIL: "Resend Otp ",
    OTP_VERIFICATION_EMAIL: "Otp Verification",
    USER_CREDENTIALS: "User Credentials",
    ADMIN_LOGIN_EMAIL: "Admin Login ",
    NEW_USER_REGISTER: `Welcome to ${constant.website_info.custodialWallet}! Your Account Details Inside`

  },

  EMAIL_TEMPLATE: {

    LOGIN_EMAIL: (token) => {
      return `
      To complete the account login process, your otp code is: <b>${token}</b>  <br> <br><br>
      Regards, <br> <br>
${constant.website_info.custodialWallet} Admin Team
      ;
    `;
    },


    RESEND_OTP: (token) => {
      return `
        Your new otp verification number for ${constant.website_info.custodialWallet} is: ${token}.Please put this number to given box to complete the process.Thanks!
        <br> <br><br>
        Regards, <br> <br>

        ${constant.website_info.custodialWallet} Admin Team
        ;`;
    },

    FORGOT_PASSWORD: (token) => {
      return `
        For the completion of reset password prcoess your otp token is: ${token}.
        <br> <br><br>
        Regards, <br> <br>

        ${constant.website_info.custodialWallet} Admin Team
        ;`;
    },
    USER_CREDENTIALS: (email, password) => {
      return `
        For the completion of reset password prcoess your otp token is: ${token}.
        <br> <br><br>
        Regards, <br> <br>

        ${constant.website_info.custodialWallet} Admin Team
        ;`;
    },

    USER_CREATION_BY_ADMIN: (email, password, name) => {
      return `
        Dear ${name}, <br>

      Welcome to ${constant.website_info.custodialWallet}! We're excited to have you as part of our community. Below are your account details: <br> <br>
      
      Email Address: ${email} <br>
      Password: ${password}  <br> <br>
      
      For security reasons, we recommend changing your password immediately after your first login. <br>
      
      If you have any questions or need assistance, feel free to reply to this email.
      
     







        <br> <br><br>
        Regards, <br> <br>

        ${constant.website_info.custodialWallet} Admin Team
        ;`;
    }

  }
}

