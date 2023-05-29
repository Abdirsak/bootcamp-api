const ErrorResponse = require('../utils/ErrorResponse')
const Course = require('../models/Course')
const asyncHandler = require('../middleware/assync')

exports.getCourse = asyncHandler(async (req , res , next)=>{
    let query ;
    if(req.params.bootcampId){
        query = Course.find({bootcamp : req.params.bootcampId})
    }else{
        query = Course.find()
    }
    console.log('request param: ',req.params)
    const courses = await query;
    res.status(200).send({
        success: true,
        count : courses.length,
        data : courses
    })

})