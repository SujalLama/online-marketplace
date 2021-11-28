const Course = require('../models/course.model')
const errorHandler = require('./../helpers/dbErrorHandler')


const create = async (req, res) => {
  let filename = '';
  if(req.file) {
    filename = req.file.filename
  }

  console.log(req.body);

  let course = new Course({...req.body, image: 'course/' + filename, instructor: req.profile});
    try {
      let result = await course.save()
      res.json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

/**
 * Load course and append to req.
 */
const courseByID = async (req, res, next, id) => {
  try {
    let course = await Course.findById(id).populate('instructor', '_id name')
    if (!course)
      return res.status('400').json({
        error: "Course not found"
      })
    req.course = course
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve course"
    })
  }
}

const read = (req, res) => {
  return res.json(req.course)
}

const list = async (req, res) => {
  try {
    let courses = await Course.find().select('name email image updated created')
    res.json(courses)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  const {name, description, category, published, lessons} = req.body;
  
  let filename = '';
  if(req.file) {
    filename = req.file.filename
  }
  
  let course = req.course
  if(filename) {
    course.image = 'course/' + filename
  }

  if(published !== undefined) {
    course.published = published
    course.updated = Date.now()
  } else {
    course.name = name
    course.description = description
    course.category = category
    course.updated = Date.now()
    course.lessons = eval(lessons)
  }
    try {
      await course.save()
      res.json(course);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  // })
}

const newLesson = async (req, res) => {
  try {
    let lesson = req.body.lesson
    console.log(lesson);
    let result = await Course.findByIdAndUpdate(req.course._id, {$push: {lessons: lesson}, updated: Date.now()}, {new: true})
                            .populate('instructor', '_id name')
                            .exec()
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let course = req.course
    let deleteCourse = await course.remove()
    res.json(deleteCourse)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isInstructor = (req, res, next) => {
    const isInstructor = req.course && req.auth && req.course.instructor._id.toString() === req.auth._id.toString()
    if(!isInstructor){
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
}

const listByInstructor = (req, res) => {
  Course.find({instructor: req.profile._id}, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(courses)
  }).populate('instructor', '_id name')
}

const listPublished = (req, res) => {
  Course.find({published: true}, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(courses)
  }).populate('instructor', '_id name')
}

const photo = (req, res, next) => {
  if(req.course.image.data){
    res.set("Content-Type", req.course.image.contentType)
    return res.send(req.course.image.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  // return res.sendFile(process.cwd()+defaultImage)
}


module.exports = {
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
