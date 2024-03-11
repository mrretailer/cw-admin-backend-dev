// const { body, param, query, check } = require("express-validator");
// const ErrorMessages = require("../constants/errors");
// const infoMessages = require("../constants/messages");
// const constant = require("../constants/constant");


// let chainType = ["ETH", "MATIC"];

// module.exports.lazyMintingValidation = () => [
//   body("publicAddress")
//     .exists()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("public_address")
//     )
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("public_address")
//     )
//     .bail()
//     .isString()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
//         "public_address"
//       )
//     ),

//   body("chain")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("chain"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("chain"))
//     .bail()
//     .isString()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("chain")
//     )
//     .bail().custom((value) => validateChain(value))
//     .withMessage("Invalid chain only allowed ETH|MATIC"),
  

//   body("metadata")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("metadata"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("metadata"))
//     .bail()
// ];


// module.exports.getUserWalletValidation = () => [
//   query("userId")
//     .exists()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("userId")
//     )
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("userId")
//     ),
// ];

// module.exports.userTransSearch = () => [
//   query("search")
//     .exists()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("search")
//     )
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("search")
//     ),
// ];

// module.exports.getUserValidation = () => [
//   query("userId")
//     .exists()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("public_address")
//     )
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("public_address")
//     ),
// ];




// module.exports.userStatusValidation = () => [
//   query("userID")
//     .exists()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("User ID")
//     )
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("User ID")
//     ),

//   query("status")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("status"))
//     .bail()
//     .isBoolean()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.INVALID_TYPE("status")),

// ];

// module.exports.userTransValidation = () => [
//   query("userId")
//     .exists()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("public_address")
//     )
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(
//       ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("public_address")
//     ),
// ];

// module.exports.uuidValidation = () => [
//   query('userID')
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING('userID'))
//     .bail()
//     .isUUID()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.INVALID_UUID),
// ]



// module.exports.resendOtpValidation = () => [
//   body('userID')
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING('userID'))
//     .bail()
//     .isUUID()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.INVALID_UUID),
// ];

// module.exports.searchValidation = () => [

//   body("searchTerm")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("searchTerm"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("searchTerm"))
//     .bail()
//     .isString()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("searchTerm"))



// ];


// module.exports.validateRequestID = () => [

//   query("requestId")
//     .exists()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("requestId"))
//     .bail()
//     .not()
//     .isEmpty()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("requestId"))
//     .bail()
//     .isString()
//     .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("requestId"))



// ];
// const validateChain = (chain) => {
//   return chainType.find((x) => x === chain) ? true : false;
// };