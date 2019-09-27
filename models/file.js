var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('mongoose-unique-validator');
// var moment = require('moment');

var yearsValidator = [
    'Primer',
    'Segundo',
    'Tercer',
    'Cuarto',
    'Quinto',
    'Sexto',
    'Persona',
    'No asignable'
];
var statusValidator = [
    'activo',
    'inactivo',
]

var FileSchema = new Schema({
    name: { type: String, required: [true, 'Nombre del archivo es obligatorio.'], unique: [true, 'Nombre duplicado.'] },
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    origin: [{
        from_id: { type: Schema.Types.ObjectId, ref: 'From', required: true},
        career_id: { type: Schema.Types.ObjectId, ref: 'Career', required: true},
        year: {type: String, required: true, default: 'Primer', enum: yearsValidator }
    }],
    status: { type: String, required: [ true, 'Estado requerido'], enum: statusValidator, default: 'activo'},
    created_at: { type: Number, default: Date.now(), required: true},
    obs: { type: String}
    // modified_at: { type: Number}
})

module.exports = mongoose.model('File', FileSchema);