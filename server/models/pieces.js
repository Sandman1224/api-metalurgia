const mongoose = require('mongoose')

let Schema = mongoose.Schema

let pieceSchema = new Schema({
    piece_number: {
        type: String,
        unique: true,
        required: [true, 'Piece number is mandatory']
    },
    machine_id: {
        type: mongoose.ObjectId,
        required: [true, 'Machine_id field is mandatory']
    },
    template_id: {
        type: mongoose.ObjectId,
        required: [true, 'Template_id field is mandatory']
    },
    status: {
        type: Number,
        required: [true, 'Status is mandatory']
    },
    piece_case: {
        type: String,
        required: [true, 'Piece case is mandatory']
    },
    causes: [String],
    created: {
        type: Number,
        required: [true, 'Created date is mandatory']
    },
    created_by: {
        type: String,
        required: [true, 'Created by is mandatory']
    },
    updated: Number
})

module.exports = mongoose.model('Piece', pieceSchema)