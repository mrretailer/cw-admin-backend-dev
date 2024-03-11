const {
    errorResponse,
    successResponse,
} = require("../utils/responses");
const axios = require("axios");
const EVMWallet = require("../utils/EVMWallet");
const constant = require("../constants/constant");
const ErrorMessages = require("../constants/errors");
const nft = require("../dbMethod/nft");
const InfoMessages = require("../constants/messages");
const common = require("../dbMethod/common");




exports.getAllNftTrans = async (db, req, res) => {
    try {

        const pageNumber = req.query.pageNumber || constant.pagination.defaultPageNumber;
        const pageSize = req.query.pageSize || constant.pagination.defaultPageSize;
        let nftTransaction = await nft.getAllNftTrans(db, pageNumber, pageSize);

        return successResponse(
            res,
            InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Nft transactions"),
            200,
            true,
            nftTransaction
        );
    } catch (error) {
        console.error("Error retrieving users:", error);
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("get all nft minting list", error), 500);
    }
};


exports.getNftDetail = async (db, req, res) => {

    try {

        const { requestId } = req.query;
        let detail = await nft.nftDetail(db, requestId);
        if (!detail) return errorResponse(res, 'No NFT transaction against this request_id', 404);

        return successResponse(
            res,
            InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("NFT request detail"),
            200,
            true,
            detail
        );
    }

    catch (error) {
        console.error("Error retrieving users:", error);
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Nft lazy Minting", error), 500);
    }
};


exports.createNftRequest = async (db, req, res) => {
    try {
        
        const { publicAddress, metadataFileUrl, chain } = req.body;
        console.log('Younas---------3', publicAddress, metadataFileUrl, chain)
        const { project_id } = req.project;
        let user_id = await nft.getIdAgainstAddress(db, publicAddress, chain);

        if (!user_id) return errorResponse(res, ErrorMessages.TRANSACTION_ERROR.WALLET_NOT_FOUND, 404);
        let response;

        try {
            response = await axios.get(metadataFileUrl);
        } catch (error) {
          console.log('Younas---------4 error', error)
            console.error('Error retrieving data from the URL:', error.message);
            return errorResponse(res, "Wrong metadata url, Please enter the correct url.", 404);
        }
        const jsonData = response.data;
        console.log('Younas---------5 lazyMintingInsert')
        await nft.lazyMintingInsert(db, user_id, publicAddress, chain, jsonData, project_id, metadataFileUrl);
        console.log('Younas---------6 lazyMintingInsert')
        return successResponse(
            res,
            InfoMessages.GENERIC.ITEM_CREATED_SUCCESSFULLY("Nft create request"),
            200,
            true
        );
    } catch (error) {
      console.log('Younas---------7 error', error)
        console.error("Error retrieving users:", error);
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Nft lazy Minting", error), 500);
    }
};


exports.updateNftMint = async (db, req, res) => {
    try {
      const hash = req.body.hash;
  
      let transaction = await nft.checkNftHash(db, hash);
      
      if (!transaction) return errorResponse(res, "Invalid Hash. Please enter valid hash", 404);
  
      let newHash;
  
      if (transaction.chain === "ETH" || transaction.chain === "MATIC") {
        const web3Instance = transaction.chain === "ETH" ? global.web3eth : global.web3matic;
        newHash = await EVMWallet.retryNft(web3Instance, hash);
      }    
  
     if (!newHash) return errorResponse(res, "Error in creating new hash", 404);
  
      let updatedNft = await nft.updateNftHash(db, hash, newHash);
  
      return successResponse(
        res,
        InfoMessages.GENERIC.ITEM_CREATED_SUCCESSFULLY("Nft update request"),
        200,
        true,
        updatedNft
      );
    } catch (error) {
      console.error("Error in Nft update request:", error);
      return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Nft update request", error), 500);
    }
  };

  exports.updateBatchLimit = async (db, req, res) => {
    try {
      const { limit } = req.body;
      let updated = await common.updateLimit(db, limit);
      if (!updated) return errorResponse(res, 'Could not update the batch limit in db', 404);
  
      return successResponse(
        res,
        InfoMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY("Batch Limit"),
        200,
        true,
        updated
      );
    } catch (error) {
      console.error("Error retrieving users:", error);
      return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Batch limit update", error), 500);
    }
  };