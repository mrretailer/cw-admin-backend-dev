
const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
   console.log('Younas---------1')
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      let error = errors.array().map((err) => {
         return { message: err.msg, field: err.param };
      });
      return res.status(400).json({ success: false, errors: error });


   }
   console.log('Younas---------2')
   next()
}

module.exports = {
   validateRequest
}