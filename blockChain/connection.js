const Web3 = require('web3');
const StellarSdk = require('stellar-sdk');

const config = require('../config');

const newEthConnection = async () => {
    return new Promise(async (resolve, reject) => {
        const web3 = new Web3(new Web3.providers.HttpProvider(config.WS_URI_ETH));


        try {
          global.web3eth = web3;
            resolve();

        } catch (e) {
            console.log("ETH Connection Failed !")
        }
    })
};

const newMaticConnection = async () => {
  
    return new Promise(async (resolve, reject) => {
        const web3 = new Web3(new Web3.providers.HttpProvider(config.WS_URI_MATIC));


        try {
          global.web3matic = web3;
            resolve();

        } catch (e) {
            console.log("Matic Connection Failed !")
        }
    })

};

const newStellarConnection = async () => {
  
    return new Promise(async (resolve, reject) => {
        const Server = new StellarSdk.Server(config.WS_URI_STELLAR, {allowHttp: true});


        try {
          global.stellar = Server;
            resolve();

        } catch (e) {
            console.log("Matic Connection Failed !")
        }
    })

};



module.exports = { newMaticConnection, newEthConnection, newStellarConnection}