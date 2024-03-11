
const constant = require("../constants/constant");

async function getUserByEmailAndPassword(db, email, hash) {

  try {
    const result = await db.query(
      `SELECT * FROM ${constant.tableName.admins} WHERE email = $1 AND password = $2`,
      [email, hash]
    );
    return result?.rows?.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error inserting otp:", error);
    throw error;
  }
}

async function insertOTP(db, otpCode, userID, msg, type) {
  try {
    // Update existing rows for the given userID and otp_type to set used to true
    await db.query(
      `UPDATE ${constant.tableName.otp} SET used = true WHERE user_id = $1 AND otp_type = $2`,
      [userID, type]
    );
  
    // Insert the new row with used set to false
    const result = await db.query(
      `INSERT INTO ${constant.tableName.otp} (otp_code, otp_message, user_id, otp_type) VALUES ($1, $2, $3, $4) RETURNING *`,
      [otpCode, msg, userID, type]
    );
    if (result.rows.length === 0) throw new Error("Otp insertion failed. No rows returned.");
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting otp:", error);
    throw error;
  }
}



async function getUserAgainstOtpCode(db, userId, otpCode, otpType) {
  try {

    const result = await db.query(
      `SELECT otp_code, create_time,used FROM ${constant.tableName.otp} WHERE user_id = $1 AND otp_code = $2 AND otp_type = $3 AND used = false`,
      [userId, otpCode, otpType]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    throw error;
  }
}

async function updateOtp(db, userUUID, otpType) {
  try {
    const result = await db.query(
      `UPDATE ${constant.tableName.otp} SET used = true WHERE user_id = $1 AND otp_type = $2 RETURNING *`,
      [userUUID, otpType]
    );
    if (result.rowCount === 0) throw new Error("Update OTP failed. No rows returned.");
    return result.rowCount;
  } catch (error) {
    console.error("Error updating OTP:", error);
    throw error;
  }
}


async function insertOrUpdateOTP(db, otpCode, userID, otpDescription, otpType) {
  try {

    // Check if an OTP of the specified type already exists for the given userID
    const existingOTP = await db.query(
      `SELECT * FROM ${constant.tableName.otp} WHERE user_id = $1 AND otp_type = $2`,
      [userID, otpType]
    );

    if (existingOTP.rows.length > 0) {

      // If an OTP of the specified type exists, update the existing row
      const updateResult = await db.query(
        `UPDATE ${constant.tableName.otp}
         SET otp_code = $1, otp_message = $2,create_time = NOW(),used = false
         WHERE user_id = $3 AND otp_type = $4
         RETURNING *`,
        [otpCode, otpDescription, userID, otpType]
      );

      if (updateResult.rows.length === 0) {
        throw new Error("Otp update failed. No rows returned.");
      }

      return updateResult.rows[0];
    } else {

      // If an OTP of the specified type doesn't exist, insert a new row
      const insertResult = await db.query(
        `INSERT INTO ${constant.tableName.otp} (otp_code, otp_message, user_id, otp_type)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [otpCode, otpDescription, userID, otpType]
      );

      if (insertResult.rows.length === 0) {
        throw new Error("Otp insertion failed. No rows returned.");
      }

      return insertResult.rows[0];
    }
  } catch (error) {
    console.error("Error inserting or updating otp:", error);
    throw error;
  }
}

async function findOtpCodeAgainstType(db, otpCode, otpType) {
    try {
  
      const result = await db.query(
        `SELECT otp_code,user_id, create_time,used FROM ${constant.tableName.otp} WHERE  otp_code = $1 AND otp_type = $2 AND used = false`,
        [otpCode, otpType]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error("Error getting user ID:", error);
      throw error;
    }
  }

  async function updatePassword(db, userUUID, otpValue, otpType, hash) {
  try {
    const result = await db.query(`
      WITH updated_user AS (
        UPDATE ${constant.tableName.admins}
        SET password = $4
        WHERE id = $1
        RETURNING *
      )
      UPDATE ${constant.tableName.otp} AS otp
      SET used = true
      FROM updated_user
      WHERE otp.user_id::text = updated_user.id::text -- Cast to text to compare
        AND otp.otp_code = $2
        AND otp.used = false
        AND otp.otp_type = $3
      RETURNING otp.*, updated_user.is_active;
    `, [userUUID, otpValue, otpType, hash]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw error;
  }
}


module.exports = {
    getUserByEmailAndPassword,
    insertOTP,
    getUserAgainstOtpCode,
    updateOtp,
    insertOrUpdateOTP,
    findOtpCodeAgainstType,
    updatePassword

}