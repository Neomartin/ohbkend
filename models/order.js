var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var moment = require('moment');

var validStatus = [
    'in_progress',
    'processed',
    'completed',
    'canceled'
];

var OrderSchema = new Schema({
    client_id: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'ID de usuario obligatorio.']},
    status: { type: String, required: true, default: 'processed', enum: validStatus},
    items: [
        {
            file_id: { type: Schema.Types.ObjectId, ref: 'File', required: true},
            quantity: {type: Number, default: 1, required: true },
            price: { type: Number, default: 1, required: true},
        },
    ],
    created_at: { type: Number },
    modified_at: { tipe: Number },
    end_at: { type: Number, required: true },
    total: { type: Number, default: 1, required: true }

});

module.exports = mongoose.model('Order', OrderSchema);