const mongoose = require('mongoose')

let Schema = mongoose.Schema

const measureRange = new Schema({
    min: Number,
    max: Number,
    unit: String
})

const measureSchema = new Schema({
    type: {
        type: String,
        required: [true, 'Measure type is mandatory']
    },
    description: String,
    range: measureRange
})

let controlGuideSchema = new Schema({
    type_template: {
        type: String,
        required: [true, 'Type_template control is mandatory']
    },
    template_id: {
        type: mongoose.ObjectId,
        required: [true, 'template id is mandatory']
    },
    measures: [measureSchema],
    created: {
        type: Number,
        required: [true, 'Created date is mandatory']
    },
    created_by: {
        type: String,
        required: [true, 'Created_by user is mandatory']
    }
})

module.exports = mongoose.model('Control-guide', controlGuideSchema)