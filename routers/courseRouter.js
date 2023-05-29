const express = require('express')
const {getCourse
} = require('../contrololers/courseController')

const courseRouter = express.Router({mergeParams : true})

courseRouter.route('/').get(getCourse)

module.exports = courseRouter