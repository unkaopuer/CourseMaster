const express = require('express')
const courseCtrl = require('../controllers/course.controller')
const enrollmentCtrl = require('../controllers/enrollment.controller')
const authCtrl = require('../controllers/auth.controller')

const router = express.Router()
router.route('/api/enrollment/enrolled')
.get(authCtrl.requireSignin, enrollmentCtrl.listEnrolled)

router.route('/api/enrollment/new/:courseId')
.post(authCtrl.requireSignin,enrollmentCtrl.findEnrollment,enrollmentCtrl.create)

router.route('/api/enrollment/stats/:courseId')
.get(authCtrl.requireSignin,enrollmentCtrl.enrollmentStats)

router.route('/api/enrollment/complete/:enrollmentId')
.put(authCtrl.requireSignin,enrollmentCtrl.isStudent,enrollmentCtrl.complete)

router.route('/api/enrollment/:enrollmentId')
.get(authCtrl.requireSignin,enrollmentCtrl.isStudent,enrollmentCtrl.read)
.delete(authCtrl.requireSignin,enrollmentCtrl.isStudent,enrollmentCtrl.remove)

router.param('courseId', courseCtrl.courseByID)
router.param('enrollmentId', enrollmentCtrl.enrollmentByID)





module.exports = router