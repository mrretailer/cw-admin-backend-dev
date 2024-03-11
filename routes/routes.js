
var express = require("express");
var router = express.Router();
var db = require("../db/moonexWalletDb.connection");
const decryption = require('../middlewares/decryption');
const { validateRequest } = require("../middlewares/validateRequest");
const authentication = require("../middlewares/authentication")
const projectkeyAuthencation = require("../middlewares/projectkeyAuthencation")
var merchant = require("../controllers/merchant");
var auth = require("../controllers/auth");
var transaction = require("../controllers/transaction");
var nft = require("../controllers/nft");
const { addMerchantValidation, searchValidation, merchantStatusValidation, uuidValidation, validateRequestID, lazyMintingValidation,updateNftValidation,updateBatchLimitValidation } = require("../validations/merchantValidation")
const {
  loginAdminValidation,
  otpVerificationValidation,
  resendOtpValidation,
  forgetPasswordValidation,
  updatePasswordValidation

} = require("../validations/authValidations");

//  ==================================== Auth Routes Start =============================

router.post("/auth/login", loginAdminValidation(), validateRequest, auth.login.bind(this, db));
router.post("/auth/resend-otp-token", resendOtpValidation(), validateRequest, auth.resendOtpToken.bind(this, db));
router.post("/auth/verify-otp-token", otpVerificationValidation(), validateRequest, auth.verifyOtpToken.bind(this, db));
router.post("/auth/authenticate-user-on-forgot-credential", forgetPasswordValidation(), validateRequest, auth.forgotCredentials.bind(this, db));
router.post("/auth/reset-password", updatePasswordValidation(), validateRequest, auth.updateUserPassword.bind(this, db));

//  ==================================== Auth Routes END =============================

//  ==================================== Merhcnat Route Routes Start =============================
router.post("/merchant/add-merchant",  projectkeyAuthencation, addMerchantValidation(), validateRequest, merchant.addMerchant.bind(this, db));
router.post("/merchant/add-merchant-with-projectKey", projectkeyAuthencation, addMerchantValidation(), validateRequest, merchant.addMerchant.bind(this, db));
router.get("/merchant/get-merchants-stats", authentication, merchant.getMerchantStats.bind(this, db));
router.get("/merchant/get-all-merchants", authentication, merchant.getAllMerchants.bind(this, db));
router.post("/merchant/search-merchant", authentication, searchValidation(), validateRequest, merchant.merchantSearch.bind(this, db));
router.post("/merchant/swtich-status", authentication, merchantStatusValidation(), validateRequest, merchant.switchMerchantStatus.bind(this, db));
router.get("/merchant/merchant-detail", authentication, uuidValidation(), validateRequest, merchant.getSingleMerchantDetail.bind(this, db));
router.get("/merchant/get-merchant-wallet", authentication, uuidValidation(), validateRequest, merchant.getMerchantWalletDetail.bind(this, db));
router.get("/merchant/merchant-transactions-detail", authentication, uuidValidation(), validateRequest, merchant.getUserTransByID.bind(this, db));
//  ==================================== Merhcnat Route Routes end =============================

//  ==================================== Transaction Route Routes start =============================
router.get("/transaction/all-platform-transactions", authentication, transaction.getAllTrans.bind(this, db));
router.post("/transaction/search-transactions", authentication, searchValidation(), validateRequest, transaction.searchTransactions.bind(this, db));
//  ==================================== Transaction Route Routes END =============================

//  ==================================== NFT Route Start =============================
router.get("/nft/all-platform-nft-transactions", authentication, nft.getAllNftTrans.bind(this, db));

router.post("/nft/create-nft-request-with-auth", projectkeyAuthencation, authentication, lazyMintingValidation(), validateRequest, nft.createNftRequest.bind(this, db));



router.get("/nft/nft-request-detail-with-auth", authentication, validateRequestID(), validateRequest, nft.getNftDetail.bind(this, db));



router.post("/nft/create-nft-request", projectkeyAuthencation, lazyMintingValidation(), validateRequest, nft.createNftRequest.bind(this, db));




router.get("/nft/nft-request-detail", projectkeyAuthencation, validateRequestID(), validateRequest, nft.getNftDetail.bind(this, db));
router.post("/nft/update-mint-nft", authentication,updateNftValidation(), validateRequest, nft.updateNftMint.bind(this, db));
 router.post("/nft/update-batch-limit", authentication, updateBatchLimitValidation(), validateRequest, nft.updateBatchLimit.bind(this, db));


//  ==================================== NFT Route End =============================

module.exports.routes = router;
