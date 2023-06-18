const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')


const userSchema = new mongoose.Schema ({
    name : {
        type : String,
        required : [true , "Please add a name"]
    },
    email:{
        type: String,
        required : [true , 'Please add an email'],
        unique : true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    role : {
        type : String,
        required : [true , 'Please add a role'],
        enum : ['user' , 'publisher'],
        default : 'user'
    },
    password : {
        type : String,
        required : [true ,'Plase add a password'],
        minlength : 6,
        select : false
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    createdAt : {
        type : Date,
        default : Date.now
    }
})


userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.getSignedJwt = function (){
    return jwt.sign({id : this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    })
}

module.exports = mongoose.model('User' , userSchema)