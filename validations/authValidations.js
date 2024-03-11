const { body, param, query, check } = require("express-validator");
const ErrorMessages = require("../constants/errors");
const infoMessages = require("../constants/messages");
const constant = require("../constants/constant");

let genderType = ["Male", "Female"];

let otpMediumType = ["Email", "Phone"];

let userForgotType = ["Username", "Password"];



module.exports.loginAdminValidation = () => [
  
  body("email")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("email"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("email"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("email")
    ).bail()
    .custom((value) => validateEmail(value))
    .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("email")),

  body("password")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password")
    ),
];

module.exports.resendOtpValidation = () => [
  body('userID')
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING('userID'))
    .bail()
    .isUUID()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.INVALID_UUID),
];


module.exports.otpVerificationValidation = () => [

  body('userID')
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING('userID'))
    .bail()
    .isUUID()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.INVALID_UUID),

  body("otpCode")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("otpCode"))
    .bail()
    .isLength({
      min: constant.otpTokenLength.minLength,
      max: constant.otpTokenLength.maxLength,
    })
    .withMessage(
      ErrorMessages.AUTH.INVALID_OTP_TOKEN(
        constant.otpTokenLength.maxLength
      )
    )]

module.exports.forgetPasswordValidation = () => [

  body("email")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("email"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("email"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("email")
    )
    .bail()
    .custom((value) => validateEmail(value))
    .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("email"))

];


module.exports.updatePasswordValidation = () => [

  body("otpCode")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("otpCode"))
    .bail()
    .isLength({
      min: constant.otpTokenLength.minLength,
      max: constant.otpTokenLength.maxLength,
    })
    .withMessage(
      ErrorMessages.AUTH.INVALID_OTP_TOKEN(
        constant.otpTokenLength.minLength,
        constant.otpTokenLength.maxLength
      )
    ),

  body("password")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password")
    )
    .bail()
    .custom((value) => validatePassword(value))
    .withMessage(ErrorMessages.AUTH.INVALID_PASSWORD("Password")),


  body("confirmPassword")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password")
    ),
];




// module.exports.loginAdminValidation = () => [
//   body("email")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("email"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("email"))
//     .bail()
//     .isString()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("email")
//     ).bail()
//     .custom((value) => validateEmail(value))
//     .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("email")),

//   body("password")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
//     .bail()
//     .isString()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password")
//     ),
// ];


// module.exports.registerUserValidation = () => [

//   body("email")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("email"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("email"))
//     .bail()
//     .isString()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("email")
//     )
//     .bail()
//     .custom((value) => validateEmail(value))
//     .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("email")),


//   body("firstName")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("First name"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("First name"))
//     .bail()
//     .isString()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("First name"))
//     .bail()
//     .isLength({ min: constant.name.minLength, max: constant.name.maxLength })
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.MIN_MAX_LENGTH_ERROR("First name", constant.name.minLength - 1, constant.name.maxLength)),


//   body("lastName")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("Last name"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Last name"))
//     .bail()
//     .isString()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("Last name"))
//     .bail()
//     .isLength({ min: constant.name.minLength, max: constant.name.maxLength })
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.MIN_MAX_LENGTH_ERROR("Last name", constant.name.minLength - 1, constant.name.maxLength)),


// ];



//   body("userID")
//     .exists()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("userID")
//     )
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("userID")
//     )
//     .bail()
//     .isString()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("userID")
//     ),
// ];


// module.exports.forgetPasswordValidation = () => [

//   body("email")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("email"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("email"))
//     .bail()
//     .isString()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("email")
//     )
//     .bail()
//     .custom((value) => validateEmail(value))
//     .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("email"))

// ];



// module.exports.updatePasswordValidation = () => [


//   body("otpCode")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("otpCode"))
//     .bail()
//     .isLength({
//       min: constant.otpTokenLength.minLength,
//       max: constant.otpTokenLength.maxLength,
//     })
//     .withMessage(
//       ErrorMessages.AUTH.INVALID_OTP_TOKEN(
//         constant.otpTokenLength.minLength,
//         constant.otpTokenLength.maxLength
//       )
//     ),

//   body("password")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
//     .bail()
//     .isString()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password")
//     )
//     .bail()
//     .custom((value) => validatePassword(value))
//     .withMessage(ErrorMessages.AUTH.INVALID_PASSWORD("Password")),


//   body("confirmPassword")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
//     .bail()
//     .isString()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password")
//     ),


// ];

function validatePassword(password) {
  //const re = /^(?!.*[_\s-]{2,})[a-zA-Z0-9][a-zA-Z0-9_\-]*[a-zA-Z0-9]$/
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{9,}$/;
  return re.test(String(password));
}

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
