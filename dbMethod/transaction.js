

const constant = require("../constants/constant");

async function getAllTrans(db, pageNumber, pageSize) {

    try {
        const offset = (pageNumber - 1) * pageSize;

        const result = await db.query(
            `SELECT * FROM ${constant.tableName.transactions} 
        ORDER BY create_time DESC 
        OFFSET $1
        LIMIT $2`,
            [offset, pageSize]
        );
        const countQuery = await db.query(`SELECT COUNT(*) FROM ${constant.tableName.transactions}`);
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
        console.error('Error retrieving transactions:', error);
        throw error;
    }
}


async function searchTransactions(db, searchTerm, pageNumber, pageSize) {
    try {
        const offset = (pageNumber - 1) * pageSize;
        const query = `
          SELECT *
          FROM ${constant.tableName.transactions}
          WHERE
            LOWER(transaction_hash) LIKE $1 OR
            LOWER(sender) LIKE $1 OR
            LOWER(receiver) LIKE $1 OR
            LOWER(CAST(project_id AS TEXT)) LIKE $1 OR
            LOWER(chain) LIKE $1 OR
            CAST(amount AS TEXT) LIKE $1
          OFFSET $2
          LIMIT $3;
        `;

        // Use % to match any characters before and after the search term
        const result = await db.query(query, [`%${searchTerm.toLowerCase()}%`, offset, pageSize]);

        // Calculate the total count of records without OFFSET and LIMIT
        const countQuery = await db.query(`
          SELECT COUNT(*) 
          FROM ${constant.tableName.transactions}
          WHERE
            LOWER(transaction_hash) LIKE $1 OR
            LOWER(sender) LIKE $1 OR
            LOWER(receiver) LIKE $1 OR
            LOWER(CAST(project_id AS TEXT)) LIKE $1 OR
            LOWER(chain) LIKE $1 OR
            CAST(amount AS TEXT) LIKE $1;
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
        console.error('Error executing paginated search query:', error);
        throw error;
    }
}

module.exports = {

    getAllTrans,
    searchTransactions
}
