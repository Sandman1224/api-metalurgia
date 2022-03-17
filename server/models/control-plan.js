const mongoose = require('mongoose')

let Schema = mongoose.Schema

let measuresSchema = new Schema({
    type: {
        type: String,
        required: [true, 'type measure is mandatory']
    },
    status: {
        type: Number,
        required: [true, 'Status measure is mandatory']
    },
    created: {
        type: Number,
        required: [true, 'Created date is mandatory']
    },
    created_by: {
        type: String,
        required: [true, 'Created by user is mandatory']
    },
    measuredValue: Number
})

let controlPlanSchema = new Schema({
    type: {
        type: String,
        required: [true, 'type control is mandatory']
    },
    machine_id: {
        type: mongoose.ObjectId,
        required: [true, 'machine id is mandatory']
    },
    template_id: {
        type: mongoose.ObjectId,
        required: [true, 'template id is mandatory']
    },
    type_template: {
        type: String,
        required: [true, 'Type template is mandatory']
    },
    piece_number: {
        type: String,
        unique: true,
        required: [true, 'Piece number is mandatory']
    },
    status: {
        type: Number,
        required: [true, 'Status control is mandatory']
    },
    measures: [measuresSchema],
    created: {
        type: Number,
        required: [true, 'Created plan control date is mandatory']
    },
    created_by: {
        type: String,
        required: [true, 'Created plan control by user is mandatory']
    }
})

pieceSchema.index({ template_id: 1, piece_number: 1 })

module.exports = mongoose.model('Control-plan', controlPlanSchema)