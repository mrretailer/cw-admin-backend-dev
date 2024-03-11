
const constant = require("../constants/constant");

async function getMerchantStats(db) {

  try {

    // Get transactions for the specified user
    const userResult = await db.query(
      `SELECT COUNT(*) AS user_count FROM ${constant.tableName.users}`

    );

    // Count transactions for the specified user
    const transResult = await db.query(
      `SELECT COUNT(*) AS transaction_count FROM ${constant.tableName.transactions}`

    );
    // Count nftResultcount for the specified user
    const nftResult = await db.query(
      `SELECT COUNT(*) AS nft_count FROM ${constant.tableName.nftMinting} `

    );

    const response = {
      userCount: userResult.rows[0].user_count,
      transactionCount: transResult.rows[0].transaction_count,
      nftCount: nftResult.rows[0].nft_count,
    };

    return response;
  }

  catch (error) {
    console.error('Error retrieving user data:', error);
    throw error;
  }
}



async function getAllMerchants(db, pageNumber, pageSize) {
  try {

    // Calculate the offset based on the page number and page size
    const offset = (pageNumber - 1) * pageSize;

    // Retrieve users for the specified page
    const result = await db.query(
      `SELECT id, first_name, last_name, email, is_active, project_id, create_time
         FROM ${constant.tableName.users} 
         ORDER BY create_time DESC 
         OFFSET $1
         LIMIT $2`,
      [offset, pageSize]
    );

    // Count the total number of users
    const countQuery = await db.query(`SELECT COUNT(*) FROM ${constant.tableName.users}`);
    const totalUsers = parseInt(countQuery.rows[0].count, 10);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalUsers / pageSize);

    // Return the result along with page information
    const response = {
      pageCount: totalPages,
      users: result.rows,
    };

    return response;
  } catch (error) {
    console.error('Error retrieving users with pagination:', error);
    throw error;
  }
}


async function searchMerchant(db, searchTerm, pageNumber, pageSize) {
  try {
    const offset = (pageNumber - 1) * pageSize;



    const query =
      `SELECT id, first_name,last_name, email,is_active,project_id, create_time
        FROM ${constant.tableName.users} 
        WHERE 
        LOWER(first_name) LIKE $1 OR
        LOWER(email) LIKE $1 OR
        LOWER(last_name) LIKE $1 OR
        LOWER(username) LIKE $1
        ORDER BY create_time DESC 
        OFFSET $2
        LIMIT $3
        `;


    // Use % to match any characters before and after the search term
    const result = await db.query(query, [`%${searchTerm.toLowerCase()}%`, offset, pageSize]);

    // Calculate the total count of records without OFFSET and LIMIT
    const countQuery = await db.query(`
                SELECT COUNT(*) 
                FROM ${constant.tableName.users}
                WHERE
                LOWER(first_name) LIKE $1 OR
                LOWER(email) LIKE $1 OR
                LOWER(last_name) LIKE $1 OR
                LOWER(username) LIKE $1 ;
                `, [`%${searchTerm.toLowerCase()}%`]);


    const totalCount = parseInt(countQuery.rows[0].count, 10);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Return the paginated result along with page information
    const response = {
      pageCount: totalPages,
      currentPage: pageNumber,
      pageSize: pageSize,
      totalItems: totalCount,
      searchResults: result.rows,
    };

    return response;
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
}


async function insertMerchantWithWallets(db, user, projectID, walletArray) {
  try {
    // Insert user
    const userResult = await db.query(
      `INSERT INTO ${constant.tableName.users} (email, password, first_name, project_id, last_name) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [user.email, user.password, user.firstName, projectID, user.lastName]
    );

    const userID = userResult.rows[0].id;

    // Insert wallets
    const walletResults = await Promise.all(
      walletArray.map((wallet) =>
        db.query(
          `INSERT INTO ${constant.tableName.wallets} (user_id, project_id, public_key, secret_key, chain) 
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [userID, wallet.projectID, wallet.publicKey, wallet.privateKey, wallet.chain]
        )
      )
    );

    return { user: userResult.rows[0], wallets: walletResults.map(result => result.rows[0]) };
  } catch (error) {
    console.error("Error inserting user and wallets:", error);
    throw error;
  }
}


async function switchMerchantStatus(db, status, userID) {
  try {
    // Execute the SQL query with LIMIT and OFFSET
    const result = await db.query(
      `UPDATE ${constant.tableName.users} SET is_active = $1 WHERE id = $2`,
      [status, userID]
    );
    if (result.rowCount === 0) throw new Error("Update user status failed. No rows returned.");

    return result.rowCount;
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
}

async function getMerchantDetailByID(db, user_id) {
  try {

    const result = await db.query(
      `SELECT id, first_name, last_name, username, email, uri, is_active, project_id, create_time FROM ${constant.tableName.users} WHERE id = $1`,
      [user_id]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }
  catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
}

async function getMerchantWallet(db, user_id) {

  try {

    const result = await db.query(
      `SELECT public_key, chain, offchain_balance FROM ${constant.tableName.wallets} WHERE user_id = $1`,
      [user_id]
    );
    return result.rows.length > 0 ? result.rows : null;

  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
}


async function getUserTransactionsByID(db, userID, pageNumber, pageSize) {
    try {

        const offset = (pageNumber - 1) * pageSize;
        const result = await db.query(
            `SELECT * FROM ${constant.tableName.transactions} WHERE user_id = $1 
        ORDER BY create_time DESC 
        OFFSET $2
        LIMIT $3`,
            [userID, offset, pageSize]
        );
        // Count the total number of users
        const countQuery = await db.query(`SELECT COUNT(*) FROM ${constant.tableName.transactions} WHERE user_id = $1`, [userID]);
        const totalUsers = parseInt(countQuery.rows[0].count, 10);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalUsers / pageSize);

        // Return the result along with page information
        const response = {
            pageCount: totalPages,
            transactions: result.rows,
        };
        return response// result.rows
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error;
    }
}


module.exports = {
  insertMerchantWithWallets,
  getMerchantStats,
  getAllMerchants,
  searchMerchant,
  switchMerchantStatus,
  getMerchantDetailByID,
  getMerchantWallet,
  getUserTransactionsByID

}



