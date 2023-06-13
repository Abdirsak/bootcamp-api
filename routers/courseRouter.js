const express = require('express')
const {getCourse , getSingleCourse , addCourse,updateCourse, deleteCourse} = require('../contrololers/courseController')

const Course = require('../models/Course')
const advancedResults = require ('../middleware/advancedResult')

const courseRouter = express.Router({mergeParams : true})

courseRouter.route('/').get(advancedResults(Course , {path : 'bootcamp' , select : 'name description'}),getCourse).post(addCourse)
courseRouter.route('/:id').get(getSingleCourse).put(updateCourse).delete(deleteCourse)

module.exports = courseRouter