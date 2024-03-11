const StellarSdk = require('stellar-sdk');

const { Keypair } = require('stellar-sdk');

function createStellarWallet() {
  const keypair = Keypair.random();
  const publicKey = keypair.publicKey();
  const secretKey = keypair.secret();

  console.log('New Stellar Wallet Created:');
  console.log(`Public Key: ${publicKey}`);
  console.log(`Secret Key: ${secretKey}`);

  return { publicKey, secretKey };
}

// Example Usage:
// const newWallet = createStellarWallet();


// console.log('newWallet', newWallet) 

// return
function sendTestnetXLM(senderSecretKey, destinationPublicKey) {
StellarSdk.Networks.TESTNET; // Use Stellar Testnet

  const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
  const sourceKeys = StellarSdk.Keypair.fromSecret(senderSecretKey);

  // Check if the destination account exists
  server.loadAccount(destinationPublicKey).catch((error) => {
    if (error.response && error.response.status === 404) {
      throw new Error(`Destination account ${destinationPublicKey} does not exist on the testnet.`);
    } else {
      throw error;
    }
  }).then(() => {
    // Build the transaction
    return server.loadAccount(sourceKeys.publicKey())
      .then((sourceAccount) => {
        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: StellarSdk.Asset.native(),
            amount: '10', // Amount in XLM to send
          }))
          .setTimeout(30)
          .build();

        // Sign the transaction
        transaction.sign(sourceKeys);

        // Submit the transaction to the Stellar network
        return server.submitTransaction(transaction);
      })
      .then((result) => {
        console.log(`Transaction Hash: ${result.hash}`);
        console.log('Testnet XLM sent successfully!');
      })
      .catch((error) => {
        console.error('Error sending testnet XLM:', error.response ? error.response.data : error.message);
      });
  });
}

// Example Usage:
const senderSecretKey = 'SDHFFWEEGJQHX6LVNJGCTWBWMSDSE27F7KWAE4OXRGXKXG2YW2EILLIU'; // Replace with the secret key of the sender
const destinationPublicKey = 'GDNBTVZ2BGW3RDDE7JOUKOPDKAULWD6JE7I4DINAFYTV22AZ7ZRO7IIE'; // Replace with the public key of the destination account

sendTestnetXLM(senderSecretKey, destinationPublicKey);
