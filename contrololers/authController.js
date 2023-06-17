const ErrorResponse = require('../utils/ErrorResponse')
const User = require('../models/User')
const asyncHandler = require('../middleware/assync')


exports.register = asyncHandler(async (req, res, next)=>{
    const {name, email, password,role} = req.body

    //create user

    const response = await User.create({
        name,
        email,
        password,
        role
    })
    res.status(200).send({
        success : true
    })
})