const ErrorResponse = require("../utils/ErrorResponse")

const ErrorHandler = (err , req , res, next) =>{
    console.log(err)
    let error = {...err}
    error.message = err.message

    if (err.name === 'CastError'){
        const message = `Server Error not found Bootcamps with id: ${error.value}`
        error = new ErrorResponse(message , 404)
    }
    if(err.code === 11000){
        const message = `Duplicate value Entered`
        error = new ErrorResponse(message , 400)
    }

    if(err.name === 'ValidationError'){
        const messages = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse (messages , 404)
    }

    res.status(error.statusCode || 500).send({
        success : false,
        error : error.message || 'Server Error'
    })
}
module.exports = ErrorHandler