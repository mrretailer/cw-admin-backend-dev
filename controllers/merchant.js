const config = require("../config");
const {
  errorResponse,
  successResponse,
} = require("../utils/responses");
const EVMWallet = require("../utils/EVMWallet");
const stellarWallet = require("../utils/stellarWallet");
const CryptoJS = require("crypto-js");
const constant = require("../constants/constant");
const ErrorMessages = require("../constants/errors");
const emailService = require("../services/email.service");
const common = require("../dbMethod/common");
const merchant = require("../dbMethod/merchant");
const cypher = require("../utils/cypher");
const { generateRandomPassword } = require("../utils/utils");
const InfoMessages = require("../constants/messages");

exports.addMerchant = async (db, req, res) => {

 
  try {
    const { email, firstName, lastName } = req.body;

    // Check if email already exists
    const user_email = await common.getInformationByUniqueId(db, constant.tableName.users, "email", email);
    if (user_email) return errorResponse(res, ErrorMessages.AUTH.EMAIL_ALREADY_EXIST(email), 404);

    // Generate a random password
    const generatedPassword = await generateRandomPassword(12);

    // Hash the password
    const hash = CryptoJS.SHA256(generatedPassword).toString(CryptoJS.enc.Hex);

    // Generate OTP
    const lowerCaseEmail = email.toLowerCase();

    // Create user object
    const user = {
      email: lowerCaseEmail,
      password: hash,
      firstName,
      lastName
    };

    // Create wallets
    const stellar = stellarWallet.createWallet(global.stellar);
    const emv = EVMWallet.createWallet(global.web3eth);

    // Encrypt secrets
    const emvSecret = cypher.encrypt(emv.privateKey, req.project.project_id);
    const stellarSecret = cypher.encrypt(stellar.secretKey, req.project.project_id);


    // Create wallet array
    const walletArray = [
      { projectID: req.project.project_id, publicKey: stellar.publicKey, privateKey: stellarSecret, chain: constant.chaiName.XLM },
      { projectID: req.project.project_id, publicKey: emv.address, privateKey: emvSecret, chain: constant.chaiName.ETH },
      { projectID: req.project.project_id, publicKey: emv.address, privateKey: emvSecret, chain: constant.chaiName.MATIC }
    ];

    let insertedUser = await merchant.insertMerchantWithWallets(db, user, req.project.project_id, walletArray)
    await emailService.sendMail(email, config.EMAIL_SUBJECT.NEW_USER_REGISTER, config.EMAIL_TEMPLATE.USER_CREATION_BY_ADMIN(email, generatedPassword, firstName + " " + lastName));

    // Return success response
    return successResponse(res, InfoMessages.AUTH.REGISTER_SUCCESSFULLY_WITHOUT_OTP, 200, true, {
      email: email,
      user_id: insertedUser.user.id,
      maticPublicKey: emv.address,
      stellarPublicKey: stellar.publicKey
    });
  } catch (err) {
    // Rollback the database transaction in case of an error
    await db.query('ROLLBACK');

    // Return error response for any exception
    return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Signup operation", err), 500);
  }
};



exports.getMerchantStats = async (db, req, res) => {

  try {

    let userData = await merchant.getMerchantStats(db);
    if (!userData) return errorResponse(res, ErrorMessages.COMMON_VALIDATION_ERROR.USER_NOT_FOUND, 404);
    return successResponse(res, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Merchants stats"), 200, true, userData);

  } catch (error) {
    return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Get panel status", error), 500);
  }
};




exports.getAllMerchants = async (db, req, res) => {
  try {
    const pageNumber = req.query.pageNumber || constant.pagination.defaultPageNumber;
    const pageSize = req.query.pageSize || constant.pagination.defaultPageSize;

    let users = await merchant.getAllMerchants(db, pageNumber, pageSize);
    if (!users) return errorResponse(res, ErrorMessages.COMMON_VALIDATION_ERROR.USER_NOT_FOUND, 404);
    return successResponse(res, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Merchants"), 200, true, users
    );
  } catch (error) {
    console.error("Error retrieving users:", error);
    return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Merchant List", error), 500);
  }
};


exports.merchantSearch = async (db, req, res) => {
  try {
    const pageNumber = req.query.pageNumber || constant.pagination.defaultPageNumber;
    const pageSize = req.query.pageSize || constant.pagination.defaultPageSize;
    let userTransaction = await merchant.searchMerchant(db, req.body.searchTerm, pageNumber, pageSize);

    return successResponse(
      res,
      InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("User search"),
      200,
      true,
      userTransaction
    );
  } catch (error) {
    console.error("Error retrieving users:", error);
    return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Search user transaction", error), 500);
  }
};


exports.switchMerchantStatus = async (db, req, res) => {
  try {

    let { userID, status } = req.query;
    status = status === "true" ? true : false;

    let account = await common.getInformationByUniqueId(db, constant.tableName.users, "id", userID);
    // If no user is found, return an error response
    if (!account) return errorResponse(res, ErrorMessages.GENERIC_ERROR.RECORD_NOT_FOUND(userID), 400);


    await merchant.switchMerchantStatus(db, status, userID);
    return successResponse(res, InfoMessages.GENERIC.STATUS_SWITCH_SUCCESSFULLY);

  } catch (error) {

    return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("switch user status", error), 500);
  }
}

exports.getSingleMerchantDetail = async (db, req, res) => {

  try {

    const { userID } = req.query;
    let userDetail = await merchant.getMerchantDetailByID(db, userID);
    return successResponse(res, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Users"), 200, true, userDetail);

  }

  catch (error) {
    console.error("Error retrieving users:", error);
    return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("get single user", error), 500);
  }
};



exports.getMerchantWalletDetail = async (db, req, res) => {

  try {
    const { userID } = req.query;
    let userWallet = await merchant.getMerchantWallet(db, userID);
    return successResponse(res, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Users"), 200, true, userWallet);

  }

  catch (error) {
    return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("get users wallet", error), 500);
  }
};


exports.getUserTransByID = async (db, req, res) => {

  try {
    const { userID } = req.query;
    const pageNumber = req.query.pageNumber || constant.pagination.defaultPageNumber;
    const pageSize = req.query.pageSize || constant.pagination.defaultPageSize;
    let userTransaction = await merchant.getUserTransactionsByID(db, userID, pageNumber, pageSize);
    return successResponse(res, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("User transactions"), 200, true, userTransaction);

  } catch (error) {
    console.error("Error retrieving users:", error);
    return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("get user Transactions list", error), 500);
  }
};