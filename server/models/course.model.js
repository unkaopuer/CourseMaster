const mongoose = require('mongoose')
/*we should define Course and Lesson */
/*Lesson*/
const lessonSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:'Lesson title is required'
    },
    content:{
        type:String,
        trim:true,
    },
    resource_url:{type:String}
})
module.exports = mongoose.model('Lesson',lessonSchema)

/*Course*/
const courseSchema = new mongoose.Schema({
    coursename:{
        type:String,
        trim:true,   /* Removing whitespace */
        required:'Course name is required'
    },
    image:{
        data: Buffer,
        contentType: String
    },
    description:{
        type:String,
        trim:true
    },
    category:{
        type:String,
        trim:true,
        required:'Category is required'
    },

    updated: Date,
    
    created:{
        type:Date,
        default:Date.now
    },
    instructor:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    published:{
        type: Boolean,
        default:false
    },
    lessons:[lessonSchema]

})

module.exports = mongoose.model('Course',courseSchema)