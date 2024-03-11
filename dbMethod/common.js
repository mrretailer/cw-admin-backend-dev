
const constant = require("../constants/constant");

async function fetchUserAgainstToken(db, id) {

    try {
        const result = await db.query(
            `SELECT id,email FROM ${constant.tableName.admins} WHERE id = $1`,
            [id]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}


async function fetchUserAgainstApikey(db, apikey) {
    try {
        const result = await db.query(
            `SELECT  owner_email, id AS project_id FROM ${constant.tableName.projects} WHERE x_api_key = $1`,
            [apikey]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}


async function getInformationByUniqueId(db, tableName, key, value) {
    try {
        const result = await db.query(
            `SELECT * FROM ${tableName} WHERE ${key} = $1`,
            [value]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error checking user existence:", error);
        throw error;
    }
}


async function updateLimit(db, limit) {
   

    try {
        const result = await db.query(
            `UPDATE ${constant.tableName.configuration}
             SET batch_process_limit = $1 where id = 
             $2`,
             [limit, 1]
          );
        return result.rowCount > 0 ? result.rows : null;
    } catch (error) {
        console.error("Error inserting otp:", error);
        throw error;
    }
}

module.exports = {
    fetchUserAgainstApikey,
    getInformationByUniqueId,
    fetchUserAgainstToken,
    updateLimit
}



