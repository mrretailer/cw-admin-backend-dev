const { body, param, query, check } = require("express-validator");
const ErrorMessages = require("../constants/errors");
const infoMessages = require("../constants/messages");
const constant = require("../constants/constant");

let chainType = ["ETH", "MATIC"];

module.exports.addMerchantValidation = () => [

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
    .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("email")),


  body("firstName")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("First name"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("First name"))
    .bail()
    .isString()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("First name"))
    .bail()
    .isLength({ min: constant.name.minLength, max: constant.name.maxLength })
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.MIN_MAX_LENGTH_ERROR("First name", constant.name.minLength - 1, constant.name.maxLength)),


  body("lastName")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("Last name"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Last name"))
    .bail()
    .isString()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("Last name"))
    .bail()
    .isLength({ min: constant.name.minLength, max: constant.name.maxLength })
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.MIN_MAX_LENGTH_ERROR("Last name", constant.name.minLength - 1, constant.name.maxLength)),


];

module.exports.searchValidation = () => [

    body("searchTerm")
      .exists()
      .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("searchTerm"))
      .bail()
      .not()
      .isEmpty()
      .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("searchTerm"))
      .bail()
      .isString()
      .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("searchTerm"))
  
];

module.exports.merchantStatusValidation = () => [
  query('userID')
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING('userID'))
    .bail()
    .isUUID()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.INVALID_UUID),

  query("status")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("status"))
    .bail()
    .isBoolean()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.INVALID_TYPE("status")),

];

module.exports.uuidValidation = () => [
  query('userID')
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING('userID'))
    .bail()
    .isUUID()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.INVALID_UUID),
]

module.exports.validateRequestID = () => [

  query("requestId")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("requestId"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("requestId"))
    .bail()
    .isString()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("requestId"))
]


module.exports.lazyMintingValidation = () => [
  body("publicAddress")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("public_address")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("public_address")
    )
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "public_address"
      )
    ),

  body("chain")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("chain"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("chain"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("chain")
    )
    .bail().custom((value) => validateChain(value))
    .withMessage("Invalid chain only allowed ETH|MATIC"),
  

  body("metadataFileUrl")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("Metadata FileUrl"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Metadata FileUrl"))
    .bail()
];



module.exports.updateNftValidation = () => [
 
 
  body("hash")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("hash")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("hash")
    )
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "hash"
      )
    ),

];


module.exports.updateBatchLimitValidation = () => [
 
 
  body("limit")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("limit")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("limit")
    )
    .bail()
    

];



function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const validateChain = (chain) => {
  return chainType.find((x) => x === chain) ? true : false;
};