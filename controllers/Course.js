const Course = require('../models/CourseModel');

const createCourse = async (req, res) => {

    try {
        const course = new Course(req.body);
        const result = await course.save();

        if (result) {
            res.status(201).json(result)
        }
    } catch (err) {
        res.status(400).json({ 'status': 'nok' });
    }

}

const fetchAllCourses = async (req, res) => {
    try {
        const result = await Course.find({}, { __v: 0, _id: 1 }).exec();

        if (result) {
            const finalResult = {
                count: result.length,
                courses: result
            };

            res.status(200).json(finalResult)
        }
    } catch (err) {
        res.status(400).json({ 'status': 'nok' })
    }
};

const updateCourseId = async (req, res) => {
    try {
        const result = await Course.findByIdAndUpdate(req.body['_id'], { "cid": req.body['cid'] }, { new: 1 });

        if (result) {
            res.status(201).json(result);
        }
    } catch (err) {
        res.status(400).json({ 'status': 'nok' });
    }
};

const addCourseReferenceBooks = async (req, res) => {
    const cid = req.params.courseId;
    const { booksList } = req.body;

    try {
        const course = await Course.findOne({ _id: cid }).exec();
        if (course) {
            let newBookList = [...course.referenceBooks, ...booksList];
            course.referenceBooks = [...new Set(newBookList)];
            const updateCourse = await Course.findOneAndUpdate({ _id: cid }, course, { new: 1 });
            if (updateCourse) {
                res.status(201).json(updateCourse);
            }
        } else {
            res.status(404).json({ 'status': 'Unable to fetch the course with given course ID.' });
        }
    } catch (err) {
        res.status(500).json({ 'status': 'nok' });
    }
}

const addCourseTextBooks = async (req, res) => {
    const cid = req.params.courseId;
    const { textBooks } = req.body;
    try {
        const course = await Course.findOne({ _id: cid }).exec();

        if (course) {
            let textBooksList = [...course.textBooks, ...textBooks];
            course.textBooks = [...new Set(textBooksList)];
            console.log("Updated Course", course);
            const updatedCourse = await Course.findOneAndUpdate({ _id: cid }, course, { new: 1 });

            if (updatedCourse) {
                res.status(201).json(updatedCourse);
            }
        } else {
            res.status(404).json({ 'status': 'Course not found with given id.' })
        }
    } catch (err) {
        res.status(500).json({ 'status': 'nok', 'err': err })
    }
};

const fetchCourseById = async (req, res) => {
    const courseId = req.params['courseId'];

    try {
        const course = await Course.findOne({ cid: { $regex: courseId, $options: 'i' } }).select({ __v: 0 }).exec();

        if (course) {
            res.status(200).json(course)
        } else {
            res.status(404).json({ 'status': 'Course not found with given course id.' })
        }
    } catch (err) {
        res.status(500).json({ 'status': 'nok' })
    }
}

const removeTextBooksForCourse = async (req, res) => {
    const cid = req.params['cid'];
    const { textBooks } = req.body;

    try {
        const course = await Course.findOne({ 'cid': cid }).exec();
        if (course) {
            let newTBList = [...course.textBooks];
            console.log('newtb', newTBList);
            newTBList = newTBList.filter(item => {
                let isNotAvailable = true;
                console.log(item);

                for (let i = 0; i < textBooks.length; i++) {
                    if (textBooks[i].toLowerCase() === item.toLowerCase()) {
                        isNotAvailable = false;
                        break;
                    }
                }

                return isNotAvailable;
            })

            course.textBooks = newTBList;

            const updateCourse = await Course.findOneAndUpdate({ cid: cid }, course, { new: 1 }).exec();

            if (updateCourse) {
                res.status(200).json(updateCourse);
            }
        } else {
            res.status(404).json({ 'status': 'Course not found with given course Id.' })
        }
    } catch (err) {
        res.status(500).json({ 'status': 'nok', 'err': err });
    }
}

const removeReferenceBooksFromcourse = async (req, res) => {
    const cid = req.params['cid'];
    const { refBooks } = req.body;
    try {
        const course = await Course.findOne({ cid }).exec();

        if (course) {
            let refBookList = course.referenceBooks;

            refBookList = refBookList.filter(item => {
                let isNotAvailable = true;

                for (let i = 0; i < refBooks.length; i++) {
                    if (refBooks[i].toLowerCase() === item.toLowerCase()) {
                        isNotAvailable = false;
                        break;
                    }
                }

                return isNotAvailable;
            });

            course.referenceBooks = refBookList;

            const updateCourse = await Course.findOneAndUpdate({ cid }, course, { new: 1 });

            if (updateCourse) {
                res.status(200).json(updateCourse)
            }
        } else {
            res.status(404).json({ 'status': 'No Course found with given course id.' });
        }
    } catch (err) {
        res.status(500).json({ 'status': 'nok' })
    }
}

const deleteCourse = async (req, res) => {
    const cid = req.params['courseId'];

    try {
        const course = await Course.findOneAndDelete({ cid }).exec();

        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ 'status': 'No Course found with given course id.' });
        }
    } catch (err) {
        res.status(500).json({ 'status': 'nok' });
    }
};

const fetchCoursesByScenario = async (req, res) => {
    const { teachingHours, credits, sortBy } = req.query;

    try {
        const result = await Course.find({
            $and: [
                {
                    "teachingHours": {
                        $gte: Number(teachingHours)
                    }
                },
                {
                    "credits": {
                        $gte: Number(credits)
                    }
                }
            ]
        }).sort({ teachingHours: sortBy, credits: sortBy });

        if (result) {
            let finalResponse = {
                count: result.length,
                courses: result
            }
            res.status(200).json(finalResponse);
        }
    } catch (err) {
        res.status(500).json({ 'status': 'nok' });
    }
}

const updateCourseTeachingHours = async (req, res) => {
    const { hours, credits, operation } = req.body;

    try {

        if (operation.toLowerCase() === "inc") {
            const result = await Course.updateMany({ credits: { $gte: credits } }, { $inc: { teachingHours: Number(hours) }, updatedTeachingHours: true }).exec();

            if (result) {
                res.status(200).json(result);
            }
        } else if (operation.toLowerCase() === "dec") {
            const result = await Course.updateMany({ credits: { $gte: Number(credits) } }, { $inc: { teachingHours: Number(hours) * -1 }, updatedTeachingHours: true }).exec();

            if (result) {
                res.status(200).json(result);
            }
        }
    } catch (err) {
        res.status(500).json(`{'status': 'nok', 'err' : ${err}}`)
    }
};

const deleteCourseWithCourseId = async (req, res) => {
    const { courseId } = req.body;

    try {
        const result = await Course.deleteOne({ cid: courseId }).exec();

        if (result) {
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json("{'status': 'nok'}")
    }
};

const deleteCourses = async (req, res) => {
    const { credits } = req.body;

    try {
        const result = await Course.deleteMany({ credits: { $gte: credits } }).exec();

        if (result) {
            res.status(200).json(result)
        }
    } catch (err) {
        res.status(500).json("{'status': 'nok'}")
    }
};


module.exports = {
    createCourse,
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
    deleteCourses
}