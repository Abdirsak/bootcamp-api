const ErrorResponse = require('../utils/ErrorResponse')
const bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/assync')
const geocoder = require('../utils/geocoder')
const path = require('path')

exports.getBootcamps = asyncHandler (async(req , res , next)=>{
        res.status(200).send(res.advancedResults)
})
exports.getBootcamp = asyncHandler (async(req , res , next)=>{
    const resp = await bootcamp.findById(req.params.id)
    if(!resp){
       return next(new ErrorResponse(`Bootcamp not found of id: ${req.params.id}` , 404))
    }
    res.status(200).send({success:true, data: resp})
})
exports.updateBootcamp = asyncHandler (async(req , res , next)=>{
    const updatedbootcamp = await bootcamp.findByIdAndUpdate(req.params.id , req.body, {new:true})
    if(!updatedbootcamp){
    return next(new ErrorResponse (`not found id:${req.params.id}`,404))
   }
   res.send({success: true , msg : `Update bootcamp ${req.params.id}`})
})
exports.deleteBootcamps = asyncHandler (async(req , res , next)=>{
        const deletedbootcamps = await bootcamp.findById(req.params.id)
        if(!deletedbootcamps){
        return next(new ErrorResponse(`not found id:${req.params.id}`))
    }
    deletedbootcamps.deleteOne()
    res.send({success: true , msg : `Delete bootcamp ${req.params.id}`})
})
exports.addBootcamp = asyncHandler (async(req , res , next)=>{
        const resp = await bootcamp.create(req.body)
        res.status(201).send({
        success : true,
        data : resp
    })
})

//get bootcamp within the radius
exports.getBootcampsInRadius = asyncHandler (async(req , res , next)=>{
    const {zipcode , distance} = req.params
    const loc = await geocoder.geocode(zipcode)

    const latitude = loc[0].latitude
    const longitude = loc[0].longitude

    const radius = distance /3963

    const bootcamps = await bootcamp.find({
        location : {$geoWithin : {$centerSphere :[[longitude , latitude], radius ] } }
    })
    res.status(200).send({
        success : true,
        count : bootcamps.length,
        data : bootcamps
    })
})

exports.bootcampPhotoUpload = asyncHandler (async(req , res , next)=>{
    const bootcamps = await bootcamp.findById(req.params.id)
    if(!bootcamps){
    return next(new ErrorResponse(`bootcamp not found with id of:${req.params.id}`))
}

if(!req.files){
    return next(new ErrorResponse(`please upload a file`, 400))
}
const file = req.files.file;

//make sure the uploaded file is a photo 
if(!file.mimetype.startsWith('image')){
    return next(new ErrorResponse(`only photo is allowed`, 400))
}

//check the size of photo
if(file.size > process.env.MAX_FILE_UPLOAD){
    return next(new ErrorResponse(`only photo less that ${process.env.MAX_FILE_UPLOAD} is allowed`, 400))
}


//create custom file name 
file.name = `photo_${bootcamps._id}${path.parse(file.name).ext}`

//upload file 
file.mv (`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err =>{
    if(err){
        console.log(err);
        return next(new ErrorResponse(`Problem with file upload`, 500))
    }
    await bootcamp.findByIdAndUpdate(req.params.id, {photo : file.name})

    res.status(200).send({
        success : true,
        data : file.name
    })
})

})
