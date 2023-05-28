const express = require('express')
const {addBootcamp , 
       getBootcamps ,
       getBootcamp ,
       updateBootcamp ,
       deleteBootcamps,
       getBootcampsInRadius
} 
       = require('../contrololers/bootcampController')

const bootcampRouter = express.Router()

bootcampRouter.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

bootcampRouter.route('/')
.get(getBootcamps)
.post(addBootcamp)

bootcampRouter.route('/:id')
.get(getBootcamp).delete(deleteBootcamps).put(updateBootcamp)


module.exports = bootcampRouter
