const config = require("../config");
const jwt = require('jsonwebtoken');
const moment = require("moment");
const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require('uuid');


const isValidJWT = function (token) {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY, {
      json: true
    });
    return decoded;
  } catch (e) {
    return false;
  }

}


function generateOTP() {
  // const digits = '123456789'; // Exclude 0 from the possible starting digits
  // let OTP = digits[Math.floor(Math.random() * 9)]; // Ensure the first digit is not 0

  // for (let i = 1; i < 6; i++) {
  //   OTP += digits[Math.floor(Math.random() * 9)];
  // }
  let OTP = '123456'
  return OTP;
}
async function timeDifference(create_time) {
  try {

    var utcMoment = moment.utc();
    var utcDate = new Date(utcMoment.format());
    var diff = (utcDate.getTime() - create_time) / 1000;
    const diffInMinute = diff / 60;
    return diffInMinute
  } catch (e) {
    return false;

  }
}

async function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

async function generateUUID() {
  // Generate a version 4 UUID
const newUUID = uuidv4();

return newUUID
}


let hashData = (data)=>{
  var hash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  return hash
}




module.exports = {
  isValidJWT: isValidJWT,
  generateOTP,
  timeDifference,
  generateRandomPassword,
  generateUUID,
  hashData
}