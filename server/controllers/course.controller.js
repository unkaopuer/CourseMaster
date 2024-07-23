const Course = require('../models/course.model')
const extend = require('lodash/extend')
const fs = require('fs')
const errorHandler = require('../helpers/dbErrorHandler')
const defaultImage = require('../../client/assets/images/default.png')
const formidable = require('formidable')
const path = require('path')

const create = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async(err,fields,files) => {
        if(err){
            return res.status(400).json({
                error:"Image could not be uploaded"
            })
        }
    let course = new Course(fields); 
    course.instructor = req.profile

    if(files.image){
        course.image.data = fs.readFileSync(files.image.path)
        course.image.contentType = files.image.type
    }
    try {
        let result = await course.save()
        res.json(result)
    }catch(err){
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })
    }
    })
}

const courseByID = async(req,res,next,id) => {
    try{
        let course =await Course.findById(id).populate('instructor','_id username')
        if(!course)
            return res.status(400).json({
            error: "Course not found"
        })
        req.course = course
        next()
    }catch(err){
        return res.status(400).json({
            error:"Could not retrieve course"
        })
    }
}

const read = (req,res) => {
    req.course.image = undefined
    return res.json(req.course)
}

const list = async (req,res) =>{
    try{
        let courses = await Course.find().select('coursename description updated created')
        res.json(courses)
    }catch(err) {
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })
    }
}

const update = async(req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions =true
    form.parse(req,async(err,fields,files) => {
        if(err){
            return res.status(400).json({
                error:"Photo could not be uploaded"
            })
        }
        let course = req.course
        course = extend(course,fields)
        if(fields.lessons){
            course.lessons = JSON.parse(fields.lessons)
        }
        course.updated = Date.now()
        if(files.image){
            course.image.data = fs.readFileSync(files.image.path)
            course.image.contentType =files.image.type
        }
        try{
            await course.save()
            res.json(course)
        } catch(err){
            return res.status(400).json({
                error:errorHandler.getErrorMessage(err)
            })
        }
    })
}
const newLesson = async(req,res)=>{
    try {
        let lesson = req.body.lesson
        let result = await Course.findByIdAndUpdate(req.course._id,{$push:{lessons:lesson},updated:Date.now()},{new:true})
        .populate('instructor','_id username').exec()
    res.json(result)
    } catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async(req,res) =>{
    try{
        let course = req.course
        let deleteCourse = await course.remove()
        res.json(deleteCourse)
    } catch(err){
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })
    }
}

const isInstructor = (req,res,next) =>{
    const isInstructor = req.course && req.auth && req.course.instructor_id.equals(req.auth._id)
    if(!isInstructor){
        return res.status(403).json({
            error:"User is not authorized"
        })
    }
    next()
}

const listByInstructor = async (req,res) => {
   try {
    let courses = await Course.find({instructor: req.profile._id})
    .populate('instructor','_id username').exec()
    res.json(courses)
   } catch(err){
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })   
    }
}

const listPublished = async (req,res) =>{
    try{
        let courses = await Course.find({published: true})
        .select('-image').populate('instructor','_id username').exec()
        res.json(courses)
    } catch (err){
            return res.status(400).json({
                error:errorHandler.getErrorMessage(err)
            })
    }
}


const photo = (req,res,next) =>{
    if(req.course.image.data){
        res.set("Content-Type",req.course.image.contentType)
        return res.send(req.course.image.data)
    }
    next()
}
const defaultPhoto = (req,res) =>{
    return res.sendFile(path.join(process.cwd(),defaultImage))
}

module.exports={
    create,
    courseByID,
    read,
    list,
    remove,
    update,
    isInstructor,
    listByInstructor,
    photo,
    defaultPhoto,
    newLesson,
    listPublished
}