const express = require('express')
const courseCtrl = require('../controllers/course.controller')
const userCtrl = require('../controllers/user.controller')
const authCtrl = require('../controllers/auth.controller')
const { enrollmentByID } = require('../controllers/enrollment.controller')
const router = express.Router()

router.route('/api/courses/published')
.get(courseCtrl.listPublished)

router.route('/api/courses/by/:userId')
.post(authCtrl.signin,authCtrl.hasAuthorization,userCtrl.isEducator,courseCtrl.create)
.get(authCtrl.signin,authCtrl.hasAuthorization,courseCtrl.listByInstructor)

router.route('/api/courses/photo/:courseId')
.get(courseCtrl.photo,courseCtrl.defaultPhoto)

router.route('/api/courses/defaultphoto')
.get(courseCtrl.defaultPhoto)

router.route('/api/couses/:courseId/lesson/new')
.put(authCtrl.signin,courseCtrl.isInstructor,courseCtrl.newLesson)

router.route('/api/courses/:courseId')
.get(courseCtrl.read)
.put(authCtrl.requireSignin,courseCtrl.isInstructor,courseCtrl.update)
.delete(authCtrl.requireSignin,courseCtrl.isInstructor,courseCtrl.remove)

router.param('courseId', courseCtrl.courseByID)
router.param('userId', userCtrl.userByID)

module.exports = router