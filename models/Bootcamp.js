const slugify = require('slugify')
const geocoder = require('../utils/geocoder')
const mongoose = require ('mongoose')

const bootcampSchema = new mongoose.Schema({
    name:{
        type : String,
        required : [true ,' please add a name'],
        unique : true,
        trim : true,
        maxlength : [50 , 'name cannot be more than 50 characters']
    },
    slug: String,
    description : {
        type : String,
        required : [true , 'please add description'],
        maxlength : [500 , 'description cannot be more than 500 characters']
    },
    website :{
        type: String,
        match :[
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?& // =]*)/,
            'please use valid url with http or https'

        ]
    },
    phone :{
        type : String,
        maxlength:[20 , 'phone cannot be more than 20 characters']
    },
    email:{
        type: String,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    address:{
        type : String,
        required : [true , 'Please add an address']
    },
    location:{
        type :{
            type : String,
            enum: ['Point'],
            required :false
        },
        coordinates:{
            type:[Number],
            required : false,
            index : '2dsphere',
        },
        formattedAddress : String,
        street : String,
        city : String,
        state : String,
        zipcode : String ,
        country : String
    },
    careers :{
        type : [String],
        enum : [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Others'
        ]
    },
    averageRating : {
        type : Number,
        min:[1, 'Rating must be at least 1'],
        max: [10 , 'Rating cannot be more than 10 character']
    },
    averageCost : Number,
    photo :{
        type : String,
        default : 'no photo.jpg'
    },
    housing : {
        type : Boolean,
        default : false
    },
    jobAssistance :{
        type : Boolean,
        default : false
    },
    jobGuarantee :{
        type : Boolean,
        default : false
    },
    acceptGi :{
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})
bootcampSchema.pre('save' , function(next){
    this.slug = slugify(this.name, {lower : true})
    next()
})

bootcampSchema.pre('save', async function(next){
    console.log("Address is : ",this.address)
    const loc = await geocoder.geocode(this.address)
    this.location = {
        type : 'Point',
        coordinates : [loc[0].longitude, loc[0].latitude],
        formattedAddress : loc[0].formattedAddress,
        street : loc[0].streetName,
        city : loc[0].city,
        state : loc[0].stateCode,
        zipcode : loc[0].zipcode,
        country : loc[0].countryCode
    }
    this.address = undefined
    next()
})

module.exports = mongoose.model('Bootcamp',bootcampSchema)