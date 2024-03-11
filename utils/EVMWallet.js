// Validate Ethereum Address
const isValidEthereumAddress = (web3, address) => {
    return web3.utils.isAddress(address);
};

// Get Ether Balance
const getEtherBalance = async (web3, address) => {
    try {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        return balanceEth;
    } catch (e) {
        return '0';
    }
};

// Create Ethereum Wallet
const createWallet = (web3) => {
    try {
        const account = web3.eth.accounts.create();
        return {
            address: account.address,
            privateKey: account.privateKey,
        };
    }
    catch (e) {
        throw e
    }
};

// Send Ether
const sendEther = async (web3, sourcePrivateKey, destinationAddress, amount) => {
    try {
        const sourceAddress = web3.eth.accounts.privateKeyToAccount(sourcePrivateKey).address;

        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 21000; // Standard gas limit for a simple transfer
        const nonce = await web3.eth.getTransactionCount(sourceAddress);

        const txObject = {
            from: sourceAddress,
            to: destinationAddress,
            value: web3.utils.toWei(amount.toString(), 'ether'),
            gasPrice: gasPrice,
            gas: gasLimit,
            nonce: nonce,
        };

        const signedTx = await web3.eth.accounts.signTransaction(txObject, sourcePrivateKey);
        const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        return txHash;
    } catch (e) {
        throw { message: e.message };
    }
};
// transferNFT 
const transferNFT = async (web3, nftHolder, recipientAddress, nftAddress, nftID) => {
    const nftContract = new web3.eth.Contract(contractAbi, nftAddress);
    try {
        // Approve the master wallet to transfer the NFT on behalf of the user
        const approvalTx = await nftContract.methods.approve(masterWalletAddress, nftID).send({ from: nftHolder });
        
        // Transfer the NFT from the user's wallet to the recipient's address using the master wallet
        const transferTx = await nftContract.methods.safeTransferFrom(nftHolder, recipientAddress, nftID).send({ from: masterWalletAddress });
    } catch (error) {
        console.error('Error transferring NFT:', error.message);
    }
};

module.exports = {
    isValidEthereumAddress,
    createWallet,
    getEtherBalance,
    sendEther,
    transferNFT
};