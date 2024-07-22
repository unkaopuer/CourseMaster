const mongoose = require('mongoose')
/*const crypo = require('crypto')*/
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:'Name is required'
    },
    email:{
        type:String,
        trim:true,
        unique: 'Email already exists',
        match: {
            validator: /.+\@.+\..+/,
            message: 'Please fill a valid email address'
        },
        required:'Email is required',
    },
    hash_password:{
        type:String,
        required:'Password is required'
    },
    salt:String,
    updated: Date,
    created:{
        type:Date,
        default:Date.now
    },
    educator:{
        type:boolean,
        default:false
    }
})







module.exports = mongoose.model('User',userSchema)