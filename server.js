const express = require ('express')
const dotenv = require ('dotenv')
const logger = require('morgan')
const connectDB = require('./config/db')
const bootcamp = require('./routers/bootcampRouter')
const course = require('./routers/courseRouter')
const auth = require('./routers/authRouter')
const ErrorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const path = require('path')

//load env vars

dotenv.config({path: './config/config.env'});

connectDB()
const app = express()

app.use(express.json())
app.use(logger('dev'))
 
//file upload 
app.use(fileupload())

//set static folder
app.use(express.static(path.join(__dirname , 'public')))

app.use('/api/v1/auth',auth)
app.use('/api/v1/bootcamps', bootcamp)
app.use('/api/v1/courses', course)
app.use(ErrorHandler)


const PORT = process.env.PORT || 5000

app.listen(PORT , ()=>console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))