const express = require ('express')
const dotenv = require ('dotenv')
const logger = require('morgan')
const connectDB = require('./config/db')
const bootcamp = require('./routers/bootcampRouter')
const ErrorHandler = require('./middleware/error')

//load env vars

dotenv.config({path: './config/config.env'});

connectDB()
const app = express()

app.use(express.json())
app.use(logger('dev'))
 
app.use('/api/v1/bootcamps', bootcamp)
app.use(ErrorHandler)


const PORT = process.env.PORT || 5000

app.listen(PORT , ()=>console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))