const mongoose = require('mongoose')

let Schema = mongoose.Schema

let pieceSchema = new Schema({
    currentYear: {
        type: Number,
        required: [true, 'CurrentYear is mandatory']
    },
    currentMonth: {
        type: Number,
        required: [true, 'currentMonth is mandatory']
    },
    piece_number: {
        type: String,
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
}, {
    autoIndex: true
})

pieceSchema.index({ piece_number: 1, currentYear: 1, status: 1 }, { unique: true })
pieceSchema.index({ machine_id: 1, current_year: 1, current_month: 1 })

pieceSchema.on('index', error => {
    // "_id index cannot be sparse"
    if (error) {
        console.log(error.message);
    }
  });

module.exports = mongoose.model('Piece', pieceSchema)