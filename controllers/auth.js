const config = require("../config");
const {
    errorResponse,
    successResponse,
} = require("../utils/responses");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const constant = require("../constants/constant");
const ErrorMessages = require("../constants/errors");
const InfoMessages = require("../constants/messages");
const { generateOTP, timeDifference, hashData } = require("../utils/utils");
const emailService = require("../services/email.service");
const auth = require("../dbMethod/auth");
const common = require("../dbMethod/common");


//Login admin route
exports.login = async (db, req, res) => {

    try {
        var { email, password } = req.body;

        // Hash the password
        var hash = hashData(password)

        // check admin-user exist or not
        let account = await auth.getUserByEmailAndPassword(db, email, hash);

        // if admin-user not exist then return
        if (!account) return errorResponse(res, ErrorMessages.AUTH.USER_NOT_FOUND, 404)

        // if admin-user not active then return
        if (!account.is_active) return errorResponse(res, ErrorMessages.AUTH.ACCOUNT_UNVERFIED, 404);

        // generate otp
        let otpNumber = generateOTP();

        await db.query('BEGIN');

        // Insert OTP for the admin-user
        await auth.insertOTP(db, otpNumber, account.id, InfoMessages.OTP_MESSAGES.LOGIN_OTP_DESCRIPTION_MESSAGE, constant.otpType.adminLoginOtp);

        // Send login email to the admin-user
        // await emailService.sendMail(email, config.EMAIL_SUBJECT.ADMIN_LOGIN_EMAIL, config.EMAIL_TEMPLATE.LOGIN_EMAIL(otpNumber));

        // Commit the database transaction
        await db.query('COMMIT');

        // Return success response 
        return successResponse(res, InfoMessages.AUTH.LOGIN_VERIFICATION_MESSAGE, 200, true, {
            user_email: account.email,
            user_id: account.id,
        });
    }

    catch (e) {

        // Rolback the database transaction
        await db.query("ROLLBACK");

        // Return error response for any exception
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Login operation", e), 500);
    }
};


// Controller function for resending OTP token
exports.resendOtpToken = async (db, req, res) => {

    // Extract UUID from the request body
    const userID = req.body.userID;

    try {

        // Retrieve user information using the unique ID
        let user = await common.getInformationByUniqueId(db, constant.tableName.admins, "id", userID);

        // If user is not found, return a 404 error response
        if (!user) return errorResponse(res, ErrorMessages.COMMON_VALIDATION_ERROR.USER_NOT_FOUND, 404);

        // Generate a new OTP number
        let otpNumber = generateOTP();

        // Start a database transaction
        await db.query('BEGIN');
        // Update the user's OTP with the new generated OTP
        await auth.insertOTP(db, otpNumber, user.id, InfoMessages.OTP_MESSAGES.RESEND_OTP_DESCRIPTION_MESSAGE, constant.otpType.adminLoginOtp);

        // Send an email with the new OTP to the user
        await emailService.sendMail(user.email, config.EMAIL_SUBJECT.RESNED_OTP_EMAIL, config.EMAIL_TEMPLATE.RESEND_OTP(otpNumber));

        // Commit the transaction if everything is successful
        await db.query('COMMIT');

        // Return a success response indicating that OTP has been resent
        return successResponse(res, InfoMessages.AUTH.RESEND_OTP);
    }

    catch (e) {
        // If an error occurs, rollback the database transaction
        await db.query('ROLLBACK');

        // Return an error response indicating the failure of the operation
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Resend otp", e), 500);
    }
};



// Controller function for verifying otp

exports.verifyOtpToken = async (db, req, res) => {

    // Extract userID and otpCode from the request body
    const { userID, otpCode } = req.body;

    try {
        // Retrieve user information based on userID and otpCode
        let user = await auth.getUserAgainstOtpCode(db, userID, otpCode, constant.otpType.adminLoginOtp);

        // If no user is found, return an error response
        if (!user) return errorResponse(res, ErrorMessages.AUTH.INVALID_OTP, 400);


        // Calculate the time difference between the current time and the OTP creation time
        const diffInMinute = await timeDifference(user.create_time);

        // Check if the OTP has expired based on the configured expiration time
        if (diffInMinute > config.otpExpireTime) return errorResponse(res, ErrorMessages.AUTH.OTP_CODE_EXPIRED, 400);

        let account = await common.getInformationByUniqueId(db, constant.tableName.admins, "id", userID);

        // If no user is found, return an error response
        if (!account) return errorResponse(res, ErrorMessages.AUTH.USER_VERIFYING_ISSUE, 400);

        // Verify the user and update the OTP status
        await auth.updateOtp(db, userID, constant.otpType.adminLoginOtp)


        // If the user is found, generate JWT token and send success response
        const jwtToken = jwt.sign({ id: userID }, config.JWT_SECRET_KEY, { expiresIn: config.SESSION_EXPIRES_IN });
        return successResponse(res, InfoMessages.AUTH.LOGIN_MESSAGE, 200, true, { token: jwtToken, user: { id: userID, name: account.first_name + " " + account.last_name, email: account.email, username: account.username } });

    }

    catch (e) {

        // Handle any errors that occur during the verification process
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Verify otp", e), 500);
    }
};


// Controller function for forgotCredentials
exports.forgotCredentials = async (db, req, res) => {

    try {
        // Retrieve user information based on the provided email
        let user = await common.getInformationByUniqueId(db, constant.tableName.admins, "email", req.body.email);

        // If user does not exist, send a success response (ambiguous message to avoid revealing user existence)
        if (!user) return successResponse(res, InfoMessages.AUTH.FOGET_PASSWORD_OTP_SEND_SUCCESSFULLY("email"));

        // Generate a new OTP
        const otpNumber = generateOTP();

        // Start a database transaction
        await db.query('BEGIN');

        // Insert or update the OTP in the database for password reset
        await auth.insertOrUpdateOTP(db, otpNumber, user.id, InfoMessages.OTP_MESSAGES.UPDATE_PASSWORD_OTP_DESCRIPTION_MESSAGE, constant.otpType.updateOtp);

        // Send a password reset email to the user
        await emailService.sendMail(user.email, config.EMAIL_SUBJECT.FORGOT_PASSWORD_EMAIL, config.EMAIL_TEMPLATE.FORGOT_PASSWORD(otpNumber));

        // Commit the database transaction
        await db.query('COMMIT');

        // Send a success response
        return successResponse(res, InfoMessages.AUTH.FOGET_PASSWORD_OTP_SEND_SUCCESSFULLY("email"));

    }

    catch (e) {

        // Rollback the database transaction in case of an error
        await db.query('ROLLBACK');

        // Send an error response
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("forgotCredentials", e), 500);
    }
};


// Function to update user password based on OTP code
exports.updateUserPassword = async (db, req, res) => {

    try {
        // Extract necessary information from the request
        var { otpCode, password, confirmPassword } = req.body

        // Check if the provided password and confirmPassword match
        if (password !== confirmPassword) return errorResponse(res, ErrorMessages.AUTH.PASSWORD_NOT_MATCH);

        // Get user information based on the provided OTP code
        let user = await auth.findOtpCodeAgainstType(db, otpCode, constant.otpType.updateOtp);


        // If no user is found, return an error response
        if (!user) return errorResponse(res, ErrorMessages.AUTH.INVALID_OTP, 400);


        const diffInMinute = await timeDifference(user.create_time);

        // Check if the OTP has expired based on the configured expiration time
        if (diffInMinute > config.otpExpireTime) return errorResponse(res, ErrorMessages.AUTH.OTP_CODE_EXPIRED_ON_UPDATE_PASSWORD, 400);

        // Hash the provided password using SHA256
        const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

        // Update the user password in the database
        await auth.updatePassword(db, user.user_id, otpCode, constant.otpType.updateOtp, hash);

        // Return a success response
        return successResponse(res, InfoMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY("Password"));
    }

    catch (e) {

        // Handle any errors that occur during the password update process
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("updateUserPassword", e), 500);
    }
};
