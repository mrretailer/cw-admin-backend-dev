const StellarSdk = require('stellar-sdk');


// validate Public Address 
const isValidStellarAddress = (server, address) => {
    try {
        StellarSdk.Keypair.fromPublicKey(address);
        return true;
    } catch (e) {
        return false;
    }
};

// validate Secret Key
const isValidStellarSecret = (server, secret) => {
    try {
        StellarSdk.StrKey.isValidEd25519SecretSeed(secret);
        return true;
    } catch (e) {
        return false;
    }
};

// get Native Balance
const getNativeBalance = async (server, address) => {
    try {
        const account = await server.loadAccount(address);
        const balance = account.balances.find((asset) => asset.asset_type === 'native');
        return balance ? balance.balance : '0';
    } catch (e) {
        return '0';
    }
};

// create Wallet 
const createWallet = (server, ) => {

    try {
        const keypair = StellarSdk.Keypair.random();

        return {
            publicKey: keypair.publicKey(),
            secretKey: keypair.secret(),
        };
    }
    catch (e) {
        throw e
    }
};

// import Wallet 
const importWallet = (server, secretKey) => {
    try {
        const keypair = StellarSdk.Keypair.fromSecret(secretKey);
        return keypair.publicKey();
    } catch (e) {
        return 'invalid secret key';
    }
};

// send Native Coin 
const sendNativeCoin = async (sourceSecretKey, destinationPublicKey, amount) => {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.PUBLIC,
    })
        .addOperation(StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: StellarSdk.Asset.native(),
            amount: amount.toString(),
        }))
        .setTimeout(30)
        .build();
    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    return result;
};

// sign and Send the Transaction 
const signAndSendTransaction = async (server, transaction, secretKey) => {
    try {
        const sourceKeypair = StellarSdk.Keypair.fromSecret(secretKey);
        const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
        transaction.sign(sourceKeypair);
        const transactionResult = await server.submitTransaction(transaction);
        return transactionResult.hash;
    } catch (e) {
        throw { message: e.message };
    }
};
// get Transaction History by Address
const getTransactionHistoryByAddress = async (server, address) => {
    try {
        const transactions = await server.transactions().forAccount(address).call();
        return transactions.records.map((record) => {
            return {
                hash: record.hash,
                ledger: record.ledger,
                createdAt: record.created_at,
                sourceAccount: record.source_account,
                memo: record.memo,
                operations: record.operations,
            };
        });
    } catch (e) {
        throw { message: e.message };
    }
};
const sendCustomToken = async (server, sourceSecretKey, destinationPublicKey, amount, assetCode, issuerPublicKey) => {
    try {
        const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
        const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

        const asset = new StellarSdk.Asset(assetCode, issuerPublicKey);

        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET, // Adjust based on the network you're using
        })
            .addOperation(StellarSdk.Operation.payment({
                destination: destinationPublicKey,
                asset: asset,
                amount: amount.toString(),
            }))
            .setTimeout(30)
            .build();

        transaction.sign(sourceKeypair);

        const result = await server.submitTransaction(transaction);
        return result;
    } catch (e) {
        throw { message: e.message };
    }
};

module.exports = {
    isValidStellarAddress,
    isValidStellarSecret,
    createWallet,
    getNativeBalance,
    importWallet,
    signAndSendTransaction,
    sendNativeCoin,
    getTransactionHistoryByAddress,
    sendCustomToken,
};