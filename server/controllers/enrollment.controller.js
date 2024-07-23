const Enrollment = require('../models/enrollment.model')
const errorHandler = require('../helpers/dbErrorHandler')

const create = async(req,res) =>{
    let newEnrollment = {
        course:req.course,  /* Current course object */
        student:req.auth,  /* Currently logged in user (student) object */
    }
    /*Initializes lessonStatus epresenting the class status of each course */
    newEnrollment.lessonStatus = req.course.lessons.map((lesson)=>{
        return {lesson:lesson,complete:false}
    })
    const enrollment = new Enrollment(newEnrollment)
    try{    
        let result = await enrollment.save()
        return res.status(200).json(result)
    } catch(err){
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })
    }
}

const enrollmentByID = async(req,res,next,id) =>{
    try{
        let enrollment = await Enrollment.findById(id)
        .populate({path:'course',populate:{ path: 'instructor'}})
        .populate('student',"_id username")
    if(!enrollment)
        return res.status(400).json({
            error:"Enrollment not found"
        })
    req.enrollment = enrollment
    next()

    } catch(err){
        return res.status(400).json({
            error:"Could not retrieve enrollment"
        })
    }
}

const read = (req,res) =>{
    return res.json(req.enrollment)
}

const complete = async(req,res) =>{
    const { lessonStatusId, complete, courseCompleted} = req.body
    if (typeof complete !== 'boolean'){
        return res.status(400).json({error:'Invalid completion status'})
    }
    let updatedData = {
        'lessonStatus.$.complete': complete,   /*update lessonStatus complete status*/
        updated: Date.now()    /*update date*/
    }

    if(courseCompleted)
        updatedData.completed = courseCompleted

    try{
        let enrollment = await Enrollment.updateOne(
            {'lessonStatus._id':lessonStatusId},
            {'$set':updatedData})
        res.json(enrollment)

    } catch(err){
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async(req,res)=>{
    try{
        let enrollment = req.enrollment
        let deleteEnrollment = await enrollment.remove()
        res.json(deleteEnrollment)
    } catch(err){
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })
    }
}

const isStudent =(req,res,next)=>{
    const isStudent = req.auth   &&  req.enrollment.student._id.equals(req.auth._id)
    if(!isStudent){
        return res.status(403).json({
            error:"User is not enrolled"
        })
    }
    next()
}

const listEnrolled = async(req,res) =>{
    try{
        let enrollments = await Enrollment.find({student:req.auth._id})
        .sort({'completed':1}).populate('course','_id name category')
        res.json(enrollments)
    } catch(err){
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })
    }
}

const findEnrollment = async(req,res,next) =>{
    try{
        let enrollments = await Enrollment.find({course:req.course._id, student:req.auth._id})
        if(enrollments.length == 0){
            next()
        } else{
            res.json(enrollments[0])
        }
    } catch(err){
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })
    } 
}

const enrollmentStats = async(req,res) =>{
    try{
        let stats ={}
        stats.totalEnrolled = await Enrollment.find({course:req.course._id}).countDocuments()
        stats.totalCompleted = await Enrollment.find({course:req.course._id}).exists('completed',true).countDocuments()
        res.json(stats)
    } catch (err){
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })
    }
}

module.exports = {
    create,
    enrollmentByID,
    read,
    complete,
    remove,
    isStudent,
    listEnrolled,
    findEnrollment,
    enrollmentStats
}