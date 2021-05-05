const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN', 'OPERATOR'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'Firstname is mandatory']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is mandatory']
    },
    dni: {
        type: String,
        unique: true,
        required: [true, 'Dni is mandatory']
    },
    password: {
        type: String,
        required: [true, 'Password is mandatory']
    },
    role: {
        type: String,
        default: 'OPERATOR',
        enum: rolesValidos
    },
    status: {
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model('User', userSchema);