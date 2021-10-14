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
        required: [true, 'El nombre completo es obligatorio']
    },
    lastname: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    employeeId: {
        type: String,
        unique: true,
        required: [true, 'El número de empleado es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    role: {
        type: String,
        default: 'OPERATOR',
        enum: rolesValidos
    },
    status: {
        type: Number,
        required: [true, 'El status es obligatorio']
    },
});

userSchema.plugin(uniqueValidator, { message: 'El usuario ya se encuentra registrado' })

userSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}

module.exports = mongoose.model('User', userSchema);