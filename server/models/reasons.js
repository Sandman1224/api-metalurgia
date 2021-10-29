const mongoose = require('mongoose')

let Schema = mongoose.Schema

let reasonsSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is mandatory']
    },
    description: String,
    type: {
        type: String,
        required: [true, 'Type reason is mandatory']
    },
    status: {
        type: Number,
        required: [true, 'Status reason is mandatory']
    },
    created: {
        type: Number,
        required: [true, 'Created date is mandatory']
    },
    created_by: {
        type: String,
        required: [true, 'Created by is mandatory']
    },
})

module.exports = mongoose.model('Reasons', reasonsSchema)