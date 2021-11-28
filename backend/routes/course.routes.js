const express = require('express');
const courseCtrl = require('../controllers/course.controller')
const userCtrl = require('../controllers/user.controller')
const authCtrl = require('../controllers/auth.controller')
const {upload} = require('../helpers/fileHelpers')
const router = express.Router()

router.route('/published')
  .get(courseCtrl.listPublished)

router.route('/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isEducator, upload.single('course'), courseCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, courseCtrl.listByInstructor)

router.route('/photo/:courseId')
  .get(courseCtrl.photo, courseCtrl.defaultPhoto)

router.route('/defaultphoto')
  .get(courseCtrl.defaultPhoto)

router.route('/:courseId/lesson/new')
  .put(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.newLesson)

router.route('/:courseId')
  .get(courseCtrl.read)
  .put(authCtrl.requireSignin, courseCtrl.isInstructor, upload.single('course'), courseCtrl.update)
  .delete(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.remove)

router.param('courseId', courseCtrl.courseByID)
router.param('userId', userCtrl.userByID)

module.exports = router;
