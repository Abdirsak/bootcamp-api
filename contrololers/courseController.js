const ErrorResponse = require('../utils/ErrorResponse')
const Course= require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/assync')

exports.getCourse = asyncHandler(async (req , res , next)=>{
    if(req.params.bootcampId){
        const courses = await Course.find({bootcamp : req.params.bootcampId})
        return res.status(200).send({
            success : true,
            count : courses.length,
            data : courses
        })
    }else{
        res.status(200).send(res.advancedResults)
    }

})

exports.getSingleCourse = asyncHandler(async (req, res, next)=>{
    const course = await Course.findById(req.params.id).populate('bootcamp' , 'name description')

    if(!course){
        return next(new ErrorResponse(`no course with the id of ${req.params.id}`),404)
    }

    res.status(200).send({
        success : true,
        data : course
    })
})

exports.addCourse = asyncHandler(async (req , res , next)=>{
    req.body.bootcamp = req.params.bootcampId

    const getBootcamp = await Bootcamp.findById(req.params.bootcampId)

    if(!getBootcamp){
        return next(new ErrorResponse(`no bootcamp with the id of ${req.params.bootcampId}`), 404)
    }

    const course = Course.create(req.body)

    res.status(200).send({
        success : true,
        data : course
    })
})


exports.updateCourse = asyncHandler (async (req, res, next)=>{
    const response = await Course.findByIdAndUpdate(req.params.id , req.body, {new : true})

    if(!response){
        return next(new ErrorResponse(`no course with the id of ${req.params.id}`), 404)
    }

    res.status(200).send({
        success : true,
        data : response
    })
})

exports.deleteCourse = asyncHandler (async(req , res , next)=>{
    const deletedbootcamps = await Course.findById(req.params.id)
    if(!deletedbootcamps){
    return next(new ErrorResponse(`not found id:${req.params.id}`))
}
deletedbootcamps.deleteOne()
res.send({success: true , msg : `Delete course ${req.params.id}`})
})