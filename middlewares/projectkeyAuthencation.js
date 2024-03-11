const { fetchUserAgainstApikey } = require('../dbMethod/common');
const { isValidJWT } = require('../utils/utils');
var db = require("../db/moonexWalletDb.connection");


module.exports = async (req, res, next) => {
    try {
        const { apikey } = req.headers;
        if (!apikey) return res.status(401).send();
        const projectExist = await fetchUserAgainstApikey(db, apikey);
        if (!projectExist) return res.status(401).send();
        req.project = projectExist;
        next();

    } catch (e) {
        console.log("error", e)
        return res.status(401).send(e.message);
    }
}