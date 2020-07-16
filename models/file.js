var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('mongoose-unique-validator');
// var moment = require('moment');

var yearsValidator = [
    'Primero',
    'Segundo',
    'Tercero',
    'Cuarto',
    'Quinto',
    'Sexto',
    'Séptimo',
    'Octavo',
    'Inicial',
    'Medio',
    'Avanzado',
    'Persona',
    'No corresponde'
];
var statusValidator = [
    'activo',
    'inactivo',
]

var FileSchema = new Schema({
    name: { type: String, required: [true, 'Nombre del archivo es obligatorio.'], unique: [true, 'Nombre duplicado.'] },
    code: { type: Number, required: true },
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    from_id: { type: Schema.Types.ObjectId, ref: 'From', required: true},
    career_id: { type: Schema.Types.ObjectId, ref: 'Career'},
    year: {type: String, required: true, default: 'Primero', enum: yearsValidator },
    // origin: [{
    //     from_id: { type: Schema.Types.ObjectId, ref: 'From', required: true},
    //     career_id: { type: Schema.Types.ObjectId, ref: 'Career', required: true},
    //     year: {type: String, required: true, default: 'Primer', enum: yearsValidator }
    // }],
    status: { type: String, required: [ true, 'Estado requerido'], enum: statusValidator, default: 'activo'},
    created_at: { type: Number, default: Date.now(), required: true},
    obs: { type: String}
    // modified_at: { type: Number}
})

// FileSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} que sea único.'});
module.exports = mongoose.model('File', FileSchema);