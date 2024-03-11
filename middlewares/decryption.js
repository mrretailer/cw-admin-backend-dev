const { decrypt } = require('../encryption/decrypt');

module.exports = (req, res, next) => {
    try {
        req.body = decrypt(req.body.data);
        next()
    } catch (e) {
        return res.status(400).send(
            { success: false, errors: [{ message: 'Bad Encryption' }] })


    }
}