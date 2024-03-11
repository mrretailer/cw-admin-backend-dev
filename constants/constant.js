
const constant = {
    name: {
        minLength: 3,
        maxLength: 20,
    },
    lname: {
        minLength: 3,
        maxLength: 20,
    },
    middleName: {
        minLength: 3,
        maxLength: 20,
    },
    password: {
        minLength: 7,

    },
    accountName: {
        minLength: 5,

    },
    tableName: {
        wallets: "user_wallets",
        nftMinting: "nft_minting",
        transactions: "transactions",
        projects: "projects",
        otp: "otp",
        users: "users",
        admins: "admins",
        configuration: "configuration"
     
      
    },
    otpTokenLength: {
        minLength: 6,
        maxLength: 6,
    },
    website_info: {
        custodialWallet: "Custodial wallet"

    },
    otpType: {

        signupOtp: "signupOtp",
        signinOtp: "signinOtp",
        updateOtp: "updateOtp",
        withdrawOtp: "withdrawOtp",
        transferOtp: "transferOtp",
        adminLoginOtp: "adminLogin"

    },
    pagination: {
        defaultPageNumber: 1,
        defaultPageSize: 10
    },
    chaiName:{
        ETH:"ETH",
        MATIC:"MATIC",
        XLM:"XLM"

    }
    
}

module.exports = constant;