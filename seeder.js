const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const colors = require('colors')

//consfig dotenv
dotenv.config({path: './config/config.env'});

//connect to db
const connectDB = async()=>{
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected ${conn.connection.host}`)
}
connectDB()

//read file 
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/data/bootcamps.json`, 'utf-8')
    )
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/data/courses.json`, 'utf-8')
    )

//insert data into database

const ImportData = async ()=>{
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        console.log('Data Imported...'.green.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

const DeletetData = async ()=>{
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        console.log('Data Destroyed...'.red.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

if(process.argv[2]=== '-i'){
    ImportData()
}else if(process.argv[2]=== '-d'){
    DeletetData()
}