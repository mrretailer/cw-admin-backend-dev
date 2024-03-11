const config = require("../config");
const {
    errorResponse,
    successResponse,
} = require("../utils/responses");
const constant = require("../constants/constant");
const ErrorMessages = require("../constants/errors");
const transaction = require("../dbMethod/transaction");
const InfoMessages = require("../constants/messages");



exports.getAllTrans = async (db, req, res) => {
    try {

        const pageNumber = req.query.pageNumber || constant.pagination.defaultPageNumber;
        const pageSize = req.query.pageSize || constant.pagination.defaultPageSize;
        let userTransaction = await transaction.getAllTrans(db, pageNumber, pageSize);
        return successResponse(res, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Merchant transactions"), 200, true, userTransaction);

    } catch (error) {
        console.error("Error retrieving users:", error);
        return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("get merchant Transactions list", error), 500);
    }
};

exports.searchTransactions = async (db, req, res) => {
  try {
    const pageNumber = req.query.pageNumber ||  constant.pagination.defaultPageNumber;
    const pageSize = req.query.pageSize || constant.pagination.defaultPageSize;
    let result = await transaction.searchTransactions(db, req.body.searchTerm, pageNumber, pageSize)
    return successResponse(res, InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Transactions search"), 200, true, result);

  } catch (error) {
    console.error("Error retrieving users:", error);
    return errorResponse(res, ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Transactions search", error), 500);
  }
};