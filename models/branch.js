'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UniqueValidator = require('mongoose-unique-validator');

var BranchSchema = Schema({
    name          : { type: String, required: [ true, 'Nombre o identificador de Sucursal necesario.']},
    phone         : { type: String, required: [ false ]},
    adress        : { type: String, required: [ true, 'Dirección obligatorio.']},
    adress_number : { type: Number, required: [ true, 'Número de dirección obligatorio.']},
    location      : { type: String, required: [ true, 'Localidad.']},
    email         : { type: String },
    obs           : { type: String },
    status        : { type: Boolean, default: true, required: true }
});

module.exports = mongoose.model('Branch', BranchSchema)