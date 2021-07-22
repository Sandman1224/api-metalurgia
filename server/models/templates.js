const mongoose = require('mongoose')

let Schema = mongoose.Schema

let templateSchema = new Schema({
    type: {
        type: String,
        required: [true, 'Type field is mandatory']
    },
    machine_id: {
        type: mongoose.ObjectId,
        required: [true, 'Machine_id field is mandatory']
    },
    status: {
        type: Number,
        required: [true, 'Status field is mandatory']
    },
    created: {
        type: Number,
        required: [true, 'Created field template is mandatory']
    },
    created_by: {
        type: String,
        required: [true, 'Created_by field is mandatory']
    },
    updated: {
        type: Number
    },
    updated_by: {
        type: String
    }
})

module.exports = mongoose.model('Template', templateSchema)