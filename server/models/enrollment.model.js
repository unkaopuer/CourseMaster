const mongoose = require('mongoose')
const enrollmentSchema = new mongoose.Schema({
    course:{
        type:mongoose.Schema.ObjectId,
        ref: 'Course'
    },

    updated: Date,
    
    enrolled:{
        type:Date,
        default:Date.now
    },
    student:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    lessonStatus:[{
        lesson:{
            type:mongoose.Schema.ObjectId,
            ref: 'Lesson'
        },
        complete: Boolean /* The completion status of the lesson */
    }],
    completed: Boolean  /* The completion status of the entire course */
})

module.exports = mongoose.model('Enrollment',enrollmentSchema)
