

module.exports.routeResponseWithData = (res, status, message, data, statusCode = 200) => {

    return res.status(statusCode).json({
        Success: status,
        message: message,
        data: data,
    })
}

module.exports.successResponse = (res, message, statusCode = 200, status = true, data) => {
    const responseData = {
        Success: status,
        message: message,
    };

    if (data !== undefined) {
        responseData.data = data;
    }

    return res.status(statusCode).json(responseData);
};




module.exports.errorResponse = (res, message, statusCode = 400, data) => {
    const responseData = {
        errors: [{ message: message }],
    };

    if (data !== undefined) {
        responseData.data = data;
    }

    res.status(statusCode).json(responseData);
};








/**
 * 
 * @param res 
 * @param status 
 * @param message 
 */
module.exports.routeResponseOnlyMessage = (res, status, message) => {

    res.status(200).json({
        Success: status,
        message: message,
    })
}
// module.exports.errorResponse = (res, message, statusCode) => {
//     res.status(statusCode).json({
//         Success: false,
//         "errors": [{
//             message: message
//         }]

//     })
// }
module.exports.errorResponseWithData = (res, message, statusCode, data) => {
    res.status(statusCode).json({
        "errors": [{
            message: message
        }],
        data: data

    })
}
