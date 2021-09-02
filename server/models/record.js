const mongoose = require('mongoose')

let Schema = mongoose.Schema

let stopCausesSchema = new Schema({
    nameCause: String
})

let recordSchema = new Schema({
    event: {
        type: String,
        required: [true, 'Event is mandatory']
    },
    stopHour: Number,
    stopCauses: Array,
    user: {
        type: String,
        required: [true, 'User is mandatory']
    },
    created: {
        type: Number,
        required: [true, 'Created date is mandatory']
    },
})

module.exports = mongoose.model('Record', recordSchema)