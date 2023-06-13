const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title : {
        type : String,
        trim :true,
        required : [true , 'Please add course title']
    },
    description :{
        type : String,
        require : [true, 'Please add course description']
    },
    weeks :{
        type : String,
        require : [true, 'Please add Number of weeks']
    },
    tuition :{
        type : Number,
        require : [true, 'Please add Tuition cost']
    },
    minimumSkill :{
        type : String,
        required : [true , 'Please add minimum skill'],
        enum : ['beginner' , 'intermediate' , 'advanced']
    },
    scholarshipAvailable:{
        type : Boolean,
        default : false
    },
    createdAt :{
        type :Date,
        default : Date.now
    },
    bootcamp:{
        type : mongoose.Schema.ObjectId,
        ref : 'Bootcamp',
        required : true
    }
})


//Static method to get average of course tuitions

courseSchema.statics.getAverageCost = async function (bootcampId){
    const response = await this.aggregate([
        {
            $match : {bootcamp:bootcampId}
        },
        {
            $group : {
                _id : 'bootcamp',
                averageCost : {$avg : '$tuition'}
            }
        }
    ])
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageCost : Math.ceil(response[0].averageCost / 10)*10
        })
    } catch (err) {
        console.log(err);
    }
}

//call getAverageCost method after save
courseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp)
})
//call getAverageCost method before remove
courseSchema.pre('deleteOne', function(){
    this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', courseSchema)