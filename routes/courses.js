const express = require('express');

const { 
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(addCourse);// bootcamp router has :bootcampid/courses ,it will transfer here because it is post
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse); 

module.exports = router;