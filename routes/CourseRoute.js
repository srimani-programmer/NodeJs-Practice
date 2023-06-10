const express = require('express');
const router = express.Router();
const { createCourse,
    fetchAllCourses,
    updateCourseId,
    addCourseReferenceBooks,
    addCourseTextBooks,
    fetchCourseById,
    removeTextBooksForCourse,
    removeReferenceBooksFromcourse,
    deleteCourse,
    fetchCoursesByScenario,
    updateCourseTeachingHours,
    deleteCourseWithCourseId,
    deleteCourses } = require('../controllers/Course');

router.post('/course/create', createCourse);
router.get('/courses', fetchAllCourses);
router.get('/course/updatecourseid', updateCourseId);
router.get('/fetchCourse', fetchCoursesByScenario)
router.get('/fetchCourse/:courseId', fetchCourseById);
router.patch('/course/updatecourse/referenceBooks/:courseId', addCourseReferenceBooks)
router.patch('/course/updatecourse/textbooks/:courseId', addCourseTextBooks)
router.patch('/course/update/removetextbooks/:cid', removeTextBooksForCourse)
router.patch('/course/update/removereferencebooks/:cid', removeReferenceBooksFromcourse);
router.delete('/course/delete/courses', deleteCourses);
router.delete('/course/delete/:courseId', deleteCourse)
router.put('/update/teachingHours', updateCourseTeachingHours);
router.delete('/course/delete', deleteCourseWithCourseId)
module.exports = router;