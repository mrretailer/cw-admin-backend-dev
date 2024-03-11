const CryptoJS = require('crypto-js')
const config = require('../config');

// const CYPHER = process.env.CYPHER_key;

module.exports.decrypt = (data, project_id) => {
    // Convert the decrypted data to a string
    const decryptedText = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(data + project_id, config.CYPHER_KEY))
    // Extract only the data part
    const dataPart = decryptedText.split(project_id)[0];
    return dataPart;
}

module.exports.decryptKey = (data, project_id) => {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(data + project_id, config.CYPHER_KEY));
}

module.exports.encrypt = (data, project_id) => {
    try {
        return CryptoJS.AES.encrypt(data + project_id, config.CYPHER_KEY).toString();
    }
    catch (e) {
        throw e
    }
}
