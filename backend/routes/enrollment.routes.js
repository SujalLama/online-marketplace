const express = require('express');
const courseCtrl = require('../controllers/course.controller')
const enrollmentCtrl = require('../controllers/enrollment.controller')
const authCtrl = require('../controllers/auth.controller')

const router = express.Router()

router.route('/enrolled')
  .get(authCtrl.requireSignin, enrollmentCtrl.listEnrolled)

router.route('/new/:courseId')
  .post(authCtrl.requireSignin, enrollmentCtrl.findEnrollment, enrollmentCtrl.create)  

router.route('/stats/:courseId')
  .get(enrollmentCtrl.enrollmentStats)

router.route('/complete/:enrollmentId')
  .put(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.complete) 

router.route('/:enrollmentId')
  .get(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.read)
  .delete(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.remove)

router.param('courseId', courseCtrl.courseByID)
router.param('enrollmentId', enrollmentCtrl.enrollmentByID)

module.exports = router;
