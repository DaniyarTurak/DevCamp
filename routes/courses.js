const express = require('express');

const { 
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(advancedResults(Course, { // additional info, besides id
        path: 'bootcamp',
        select: 'name description' //name and descrption
    }), getCourses)
    .post(addCourse);// bootcamp router has :bootcampid/courses ,it will transfer here because it is post
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse); 

module.exports = router;