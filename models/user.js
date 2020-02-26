'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UniqueValidator = require('mongoose-unique-validator');


var rolesValidos = {
    values: [
        'ADMIN_ROLE',
        'USER_ROLE',
        'CLIENT_ROLE'
    ],
    message: '{VALUE} no es un Rol permitido.'
}
var UserSchema = Schema({
    name: { type: String, required: [true, 'El nombre es necesario.'] },
    surname: { type: String, required: [ true, 'El apellido es necesario.' ]},
    email: { type: String, required: false, index:true, unique:true, sparse:true, default: ''},
    username: { type: String, unique: [ true, 'El usuario ya existe.'], required: false},
    // dni: { type: String, unique: true, required: [ true, 'El DNI es necesario.' ]},
    dir: String,
    dir_num: String,
    nick: String,
    phone: [{type: String, prefix: Number, number: Number }],
    password: String,
    image: { type: String, default: '../assets/images/users/user.png' },
    role: { type: String, default: 'CLIENT_ROLE', required: true, enum: rolesValidos },
    observation: String,
    created_at: { type: Number, default: Date.now() }
});

UserSchema.plugin(UniqueValidator, { message: '{PATH} debe ser único.' });

module.exports = mongoose.model('User', UserSchema);