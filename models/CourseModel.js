const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cid: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    teachingHours: {
        type: Number,
        required: true
    },
    referenceBooks: {
        type: [String],
        required: false
    },
    textBooks: {
        type: [String],
        required: false
    },
    updatedTeachingHours: {
        type: Boolean,
        required: false
    },
});

const CourseModel = mongoose.model('Course', CourseSchema);

module.exports = CourseModel;