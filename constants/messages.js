
const InfoMessages = {
	AUTH: {
		REGISTER_SUCCESSFULLY: (email) => `Registered successfully.We have sent the verification OTP code.Please check your Email:${email} and verify the otp code`,
		REGISTER_SUCCESSFULLY_WITHOUT_OTP: `You registered successfully`,
		LOGIN_MESSAGE: "Login successfully",
		TOKEN_VALID: (token) => `Token ${token} is valid.`,
		RESEND_OTP: `OTP code send again`,
		VERIFY_MESSAGE: "Your account is successfully verfied",
		LOGIN_VERIFICATION_MESSAGE: "We have sent you OTP code to verify email.Please check your email",
		
		SEND_VERIFICATION_CODE_EMAIL: `We have sent you a verification code. Check your email`,
		SEND_VERIFICATION_CODE_PHONE: `We have sent you a verification code. Check your phone`,
		PASSWORD_MISMATCH: `Password and confirm password not match`,
		LOGIN_SUCCESSFULLY_OTP: (email, phone) => `We have sent the verification OTP code. Please check your Email:${email} or Phone:${phone} and verify the otp code`,
		USER_NAME_SEND_SUCCESSFULLY: (value, valu1) => `We've sent you a ${value} in your ${valu1}.`,
		FOGET_PASSWORD_OTP_SEND_SUCCESSFULLY: (value) => `We've sent you a otpCode in your ${value}.`,
		OTP_SEND_SUCCESSFULLY: (email) => `We have sent the verification OTP code. Please check your Email:${email} and verify the otp code`,
		FOGET_PASSWORD_OTP_SEND_SUCCESSFULLY: (value) => `We've sent you a otpCode in your ${value}.`,
	
	},
	GENERIC: {
		ITEM_UPDATED_SUCCESSFULLY: (value) => `${value} updated successfully.`,
		ITEM_CREATED_SUCCESSFULLY: (key) => `${key} is created successfully.`,
		ITEM_GET_SUCCESSFULLY: (key) => `${key} get successfully.`,
		STATUS_SWITCH_SUCCESSFULLY: `User status switch successfully.`,

	},
	OTP_MESSAGES: {
		SIGNUP_OTP_DESCRIPTION_MESSAGE: "OTP are generated and stored to verify the authenticity of users during the signup phase",
		UPDATE_PASSWORD_OTP_DESCRIPTION_MESSAGE: "OTP are generated and stored to verify the authenticity of users during the update password phase",
		WITHDRAW_OTP_DESCRIPTION_MESSAGE: "OTP are generated and stored to verify the authenticity of users during funds withdraw",
		TRANSFER_OTP_DESCRIPTION_MESSAGE: "OTP are generated and stored to verify the authenticity of users during funds transfer ",
		LOGIN_OTP_DESCRIPTION_MESSAGE: "OTP are generated and stored to verify the authenticity of users during the login phase of admin",
		RESEND_OTP_DESCRIPTION_MESSAGE: "Resend OTP are generated and stored to verify the authenticity of users during the login phase of admin",
	
	
	},
	TRANSACTION_MESSAGES: {
		SIGNUP_OTP_DESCRIPTION_MESSAGE: "OTPs are generated and stored to verify the authenticity of users during the signup phase",
	
	}
}

module.exports = InfoMessages;