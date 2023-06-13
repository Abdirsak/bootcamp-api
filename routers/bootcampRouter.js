const express = require('express')
const {addBootcamp , 
       getBootcamps ,
       getBootcamp ,
       updateBootcamp ,
       deleteBootcamps,
       getBootcampsInRadius,
       bootcampPhotoUpload
} = require('../contrololers/bootcampController')


const Bootcamp = require ('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResult')

//including other resource router

const  courseRouter = require('./courseRouter')

const bootcampRouter = express.Router()

//re-route into other resource router

bootcampRouter.use('/:bootcampId/courses',courseRouter)

bootcampRouter.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
bootcampRouter.route('/:id/photo').put(bootcampPhotoUpload);

bootcampRouter.route('/')
.get(advancedResults(Bootcamp , 'courses'),getBootcamps)
.post(addBootcamp)

bootcampRouter.route('/:id')
.get(getBootcamp).delete(deleteBootcamps).put(updateBootcamp)


module.exports = bootcampRouter
