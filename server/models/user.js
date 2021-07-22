const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN', 'OPERATOR'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    fullname: {
        type: String,
        required: [true, 'Fullname is mandatory']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is mandatory']
    },
    employeeId: {
        type: String,
        unique: true,
        required: [true, 'Employee Id is mandatory']
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
        type: Number
    },
});

userSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}

module.exports = mongoose.model('User', userSchema);