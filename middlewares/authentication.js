const { fetchUserAgainstToken } = require('../dbMethod/common');
const { isValidJWT } = require('../utils/utils');
var db = require("../db/moonexWalletDb.connection");


module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) return res.status(401).send();
        const decoded = isValidJWT(authorization);
        if (!decoded) return res.status(401).send();

        const user = await fetchUserAgainstToken(db, decoded.id);

        if (!user) return res.status(401).send();
        req.user = user;
        next();

    } catch (e) {
        console.log("error jdjddjdj", e)
        return res.status(401).send(e.message);
    }
}


