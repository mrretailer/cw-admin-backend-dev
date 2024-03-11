const StellarSdk = require('stellar-sdk');
const { Client } = require('pg');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


const pgClient = new Client({
        user: 'devyasin',
        host: '88.198.230.118',
        database: 'c_wallet',
        password: 'tfKh6rsr7B',
        port: 5432,
      });
      
pgClient.connect();

StellarSdk.Networks.TESTNET // Use the public Stellar network

async function listenForPayments(accountId) {
  try {
    // Load account to check if it exists
    let account = await server.loadAccount(accountId);

    // Set up a streaming connection to the account's transactions
    server.payments().forAccount(accountId).stream({ onmessage: paymentHandler });

    console.log(`Listening for payments to account: ${accountId}`);
  } catch (error) {
    // If the account is not found, log the error and skip the account
    if (error.response && error.response.status === 404) {
      console.error(`Account ${accountId} not found on the Stellar network.`);
    } else {
      console.error('Error setting up payment stream:', error);
    }
  }
}

async function paymentHandler(record) {
  try {
    // Handle incoming payments
    const { amount, asset_code, from, to, transaction_hash,  transaction_successful} = record;
    // console.log('record', record);
    let status = "Canceled"
    if(transaction_successful === true){
      status = "Completed"
    }

    // Check if transaction_hash already exists in the SQL table
    const exists = await checkTransactionExistence(transaction_hash);

    if (exists) {
      console.log(`Transaction with hash ${transaction_hash} already exists. Skipping onchainTransaction.`);
    } else {
      // If transaction_hash does not exist, run onchainTransaction
      const user = await getIdAgainstAddress(to); // Assuming 'to' is the recipient's public address
      // console.log(user);
      // console.log(user);
      if(!user){
        console.log("no user against this public_key");
      }else{

        await transferBalance( user.user_id, user.chain, from, to, amount, transaction_hash, status, user.project_id);
      }
    }
  } catch (error) {
    console.error('Error handling payment:', error);
  }
}

async function transferBalance(user_id,chain ,from, to, amount, transaction_hash, status, project_id) {
  try {
    // Start a transaction
    await pgClient.query('BEGIN');

    await pgClient.query(
      `INSERT INTO public.transactions (user_id, type, on_chain, chain, sender, receiver, amount, transaction_hash, status, project_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [user_id, "deposit", "true", chain, from, to, amount, transaction_hash, status, project_id]
    );

    // Add balance to the destination user
    await pgClient.query(
      `UPDATE public.user_wallets SET onchain_balance = onchain_balance + $1, offchain_balance = offchain_balance + $1 WHERE user_id = $2 AND chain = $3`,
      [amount, user_id, chain]
    );

    // Commit the transaction
    await pgClient.query('COMMIT');

    console.log(`Balance transfer successful to ${user_id}.`);
    return { success: true, message: 'Balance transfer successful.' };
  } catch (error) {
    // Rollback the transaction in case of an error
    await pgClient.query('ROLLBACK');

    console.error('Error transfer balance:', error);
    throw error;
  }
}
  
  async function checkTransactionExistence(transactionHash) {
    try {
      const result = await pgClient.query(
        `SELECT EXISTS(SELECT 1 FROM public.transactions WHERE transaction_hash = $1) AS exists`,
        [transactionHash]
      );
  
      // console.log('Check Transaction Existence Result:', result.rows[0]); // Add this line
  
      return result.rows[0].exists;
    } catch (error) {
      console.error('Error checking transaction existence:', error);
      throw error;
    }
  }

  async function getIdAgainstAddress( public_address) {
    try {
      // Execute the SQL query with LIMIT and OFFSET  
      const result = await pgClient.query(
        `SELECT user_id, project_id, chain FROM public.user_wallets WHERE public_key = $1`,
        [public_address]
      );

      // console.log("getIdAgainstAddress",result);
  
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw error;
    }
  }



async function setupPaymentListeners() {
  try {
    const addressesQuery = 'SELECT public_key FROM public.user_wallets WHERE chain = $1';
    const addressesResult = await pgClient.query(addressesQuery, ['XLM']);
    const addresses = addressesResult.rows.map(row => row.public_key);

    const listenerPromises = addresses.map((address) => listenForPayments(address));

    await Promise.all(listenerPromises);

  } catch (error) {
    console.error('Error setting up payment listeners:', error);
  } finally {
    // pgClient.end();
    console.log("all done");
  }
}

setupPaymentListeners()

// const interval = 10 * 60 * 1000; // 10 minutes in milliseconds
// setInterval(() => setupPaymentListeners(), interval);
