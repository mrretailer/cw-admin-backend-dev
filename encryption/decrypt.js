const Crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');

const privateKeyFile = fs.readFileSync(path.resolve(process.cwd(), 'encryption', 'private_key.pem')).toString();

module.exports.decrypt = (data) => {

    const decrypted = Crypto.privateDecrypt({ key: privateKeyFile, passphrase: '', padding: Crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data, 'base64'),);
    return JSON.parse(decrypted.toString());
}