const express = require('express')
const {getCourse , getSingleCourse , addCourse,updateCourse, deleteCourse} = require('../contrololers/courseController')

const courseRouter = express.Router({mergeParams : true})

courseRouter.route('/').get(getCourse).post(addCourse)
courseRouter.route('/:id').get(getSingleCourse).put(updateCourse).delete(deleteCourse)

module.exports = courseRouter