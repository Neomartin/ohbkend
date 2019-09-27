'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UniqueValidator = require('mongoose-unique-validator');

var tiposValidos = {
    values: [
        'universidad',
        'colegio',
        'escuela',
        'instituto',
        'persona'
    ],
    message: '{VALUE} no es un tipo permitido.'
}
var FromTypesSchema = Schema({
    name: { type: String, unique: [true, 'Este tipo ya existe'], required: [true, 'El tipo es necesario.'], enum: tiposValidos },
    obs: { type: String }
});

FromTypesSchema.plugin(UniqueValidator, { message: '{PATH} debe ser único.' });

module.exports = mongoose.model('FromType', FromTypesSchema);