const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Bootcamp = require('./models/Bootcamp')
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

//insert data into database

const ImportData = async ()=>{
    try {
        const res = await Bootcamp.create(bootcamps)
        console.log (res)
        console.log('Data Imported...'.green.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

const DeletetData = async ()=>{
    try {
        await Bootcamp.deleteMany()
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