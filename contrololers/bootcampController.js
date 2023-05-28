const ErrorResponse = require('../utils/ErrorResponse')
const bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/assync')
const geocoder = require('../utils/geocoder')

exports.getBootcamps = asyncHandler (async(req , res , next)=>{
        let query;

        //copy req.query
        let reqQuery = {...req.query}

        //fields to exclude 
        const removeFields = ['select']

        //loop over removeFields and remove them from query
         removeFields.forEach(param => delete reqQuery[param]);

        //create query string
        let queryString = JSON.stringify(reqQuery)

        //create operators ($gt ,$gte, etc)
        queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/,match =>`$${match}`)

        //finding resources
        query = bootcamp.find(JSON.parse(queryString))

        //select Fields 
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ')
            query = query.select(fields)
        }

        //sort fields
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
        }
        //executing query
        const resp = await query
        res.status(200).send({
            success: true,
            count : resp.length,
            data : resp
        })
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
        const deletedbootcamps = await bootcamp.findByIdAndDelete(req.params.id)
        if(!deletedbootcamps){
        return next(new ErrorResponse(`not found id:${req.params.id}`))
    }
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