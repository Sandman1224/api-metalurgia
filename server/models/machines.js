const mongoose = require('mongoose')

let Schema = mongoose.Schema

let machineSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Machine name is mandatory']
    },
    identifier: {
        type: Number,
        unique: true,
        required: [true, 'Machine identifier is mandatory']
    },
    devices: [
        {
            type: String,
            required: [true, 'Machine ip device is mandatory']
        }
    ],
    status: {
        type: Number
    }
})

module.exports = mongoose.model('Machine', machineSchema)