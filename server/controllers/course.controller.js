const extend = require('lodash/extend')
const Course = require('../models/course.model')
const fs = require('fs')
const errorHandler = require('../helpers/dbErrorHandler')
const defaultImage = require('../../client/assets/images/default.png')
const formidable = require('formidable')

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
    course.instructor = req.porfile

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


