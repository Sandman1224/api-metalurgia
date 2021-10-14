const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

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
    devices: {
        type: String,
        unique: true,
        validate: {
            validator: function(ipData) {
                return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipData)
            },
            message: '{VALUE} no es un valor correcto'
        },
        required: [true, 'Machine ip device is mandatory'],
    },
    status: {
        type: Number,
        required: [true, 'Machine status device is mandatory']
    },
    description: String
})

machineSchema.index({ identifier: 1, status: 1 }, { unique: true })

machineSchema.plugin(uniqueValidator, { message: 'El identificador de máquina ya se encuentra registrado' })

module.exports = mongoose.model('Machine', machineSchema)