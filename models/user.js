'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UniqueValidator = require('mongoose-unique-validator');
var beatifyUnique = require('mongoose-beautiful-unique-validation');


var rolesValidos = {
    name: [
        // access_level 1 y 4 avaible
        'SUPER_ADMIN_ROLE',
        'ADMIN_ROLE',
        'USER_ROLE',
        'CLIENT_ROLE',
    ],
    access_level: [
        5,
        3,
        2,
        0
    ],
    viewValue: [
        'Super Admin',
        'Admin',
        'Usuario',
        'Cliente'
    ],
    message: '{VALUE} no es un Rol permitido.'
}
var UserSchema = Schema({
    name: { type: String, required: [true, 'El nombre es necesario.'] },
    surname: { type: String, required: [ true, 'El apellido es necesario.' ]},
    // Acepta email undefined y null al agregar además de unique el sparse, pero tuve que hacer un dropIndex
    // en la colección de users pq daba un error de key duplicada
    email: { type: String, required: false, unique: true, sparse: true},

    username: { type: String, unique: [ true, 'El usuario ya existe.'], required: false},
    // dni: { type: String, unique: true, required: [ true, 'El DNI es necesario.' ]},
    dir: { type: String },
    dir_num: { type: Number },
    departament: { type: String },
    nick: { type: String },
    phone: [{ type: String, prefix: Number, number: Number }],
    branch: [{ type: [Schema.ObjectId], ref: 'Branch' }],
    password: { type: String },
    image: { type: String, default: '../assets/images/users/user.png' },
    role: { 
            name: { type: String, default: 'CLIENT_ROLE', required: true, enum: rolesValidos.name },
            access_level: { type: Number, default: 0, required: true, enum: rolesValidos.access_level },
            viewValue: { type: String, default: 'Cliente', required: true, enum: rolesValidos.viewValue }
    },
    observation: { type: String },
    created_at: { type: Number, default: Date.now() }
});

UserSchema.plugin(beatifyUnique);
// UserSchema.method('toJSON', function() {
    // Comment: Uso function y no Arrow Function por que necesito mantener el "this" 
    // haciendo referncia al userchema y siempre que pasen por un método toJSON

    // const { __v, _id, ...object } = this.toObject();
    // Comment: this.toObject() -> Mongoose
    // console.log('This toObject', this.toObject());

    // Comment: Línea comentada pero podría modificar la vista del objecto que retorno en *_id* por *uid*
    // object.uid = _id;
    // return object;
// });

module.exports = mongoose.model('User', UserSchema);