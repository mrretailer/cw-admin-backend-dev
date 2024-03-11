const { Pool } = require('pg')
const config = require('../config')
try {
  const dbConfig = {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    port: config.DB_PORT,
    ssl: {
      rejectUnauthorized: false,
      //mode: 'require'
    }
  }
  const pool = new Pool(dbConfig)

  pool.connect((err) => {
    if (!err) {
      console.log('Database is connected ... nn')
    } else {
      console.log('Error connecting database ... nn', err)
      throw err
    }
  })

  module.exports = pool
} catch (e) {
  console.log('Error connecting database ... nn', e)
}
