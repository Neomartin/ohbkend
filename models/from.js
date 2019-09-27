var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var FromSchema = new Schema({
    name: { type: String, unique: [true, 'Ya existe esta institución.'], required: [true, 'El nombre del establecimiento/persona es obligatorio.'] },
    number: {type: String, required: false},
    type_id: { type: Schema.Types.ObjectId, ref: 'FromType'},
    obs: { type: String}
    }, 
    // { collection: 'Hospitales'}
);

module.exports = mongoose.model('From', FromSchema );