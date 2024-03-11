const constant = require("../constants/constant");

async function getAllNftTrans(db, pageNumber, pageSize) {
    try {
        const offset = (pageNumber - 1) * pageSize;

        const result = await db.query(
            `SELECT *
         FROM ${constant.tableName.nftMinting}
         ORDER BY create_time DESC 
         OFFSET $1
         LIMIT $2`,
            [offset, pageSize]
        );

        const countQuery = await db.query(`SELECT COUNT(*) FROM ${constant.tableName.nftMinting}`);
        const totalUsers = parseInt(countQuery.rows[0].count, 10);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalUsers / pageSize);

        // Return the result along with page information
        const response = {
            pageCount: totalPages,
            nftTrans: result.rows,
        };

        return response;

    } catch (error) {
        console.error('Error retrieving NFT transactions:', error);
        throw error;
    }
}

async function nftDetail(db, requestId) {

    try {
        const result = await db.query(
            `SELECT * FROM ${constant.tableName.nftMinting} WHERE request_id = $1`,
            [requestId]
        );
        return result?.rows?.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error inserting otp:", error);
        throw error;
    }
}

async function getIdAgainstAddress(db, public_address, chain) {

    try {

        const result = await db.query(
            `SELECT user_id FROM ${constant.tableName.wallets} WHERE public_key = $1 AND chain = $2`,
            [public_address, chain]
        );


        return result.rows.length > 0 ? result.rows[0].user_id : null;
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error;
    }
}


async function lazyMintingInsert(db, user_id, public_address, chain, jsonData, id, url) {
    try {

        const result = await db.query(
            `INSERT INTO ${constant.tableName.nftMinting} (user_id, public_address, chain, status, metadata, project_id, image_uri) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING (request_id) `,
            [user_id, public_address, chain, "PENDING", jsonData, id, url]
        );
        return result.rows.length > 0 ? result.rows : null;
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error;
    }
}






async function checkNftHash(db, hash) {
    try {
        // Execute the SQL query with LIMIT and OFFSET
        const result = await db.query(
            `SELECT request_id, chain FROM ${constant.tableName.nftMinting} WHERE transaction_hash = $1 AND status = $2`,
            [hash, "IN_PROCESS"]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error;
    }
}

async function updateNftHash(db, hash, newHash) {
    try {
      // Execute the SQL query with LIMIT and OFFSET
      const result = await db.query(
        `UPDATE ${constant.tableName.nftMinting} SET transaction_hash = $1, retry_count = retry_count + 1 WHERE transaction_hash = $2 AND status = $3 RETURNING request_id`,
        [newHash, hash, "IN_PROCESS"]
      );


      return result.rows.length > 0 ? result.rows : null;
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw error;
    }
}





module.exports = {

    getAllNftTrans,
    nftDetail,
    getIdAgainstAddress,
    lazyMintingInsert,
    checkNftHash,
    updateNftHash
}
