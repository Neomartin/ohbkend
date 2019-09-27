var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');



var CareerSchema = new Schema({
    name: { type: String, unique: [ true], required: [ true, 'El nombre de la Carrera es obligatorio.']},
    from_id: { type: Schema.Types.ObjectId, ref: 'From', required: [ true, 'Debe estar vinculado a alguna institución.']},
});

module.exports = mongoose.model('Career', CareerSchema);