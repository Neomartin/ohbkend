var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var moment = require('moment');

var validStatus = [
    'processed',
    'in_progress',
    'completed',
    'canceled',
    'delivered'
];

var OrderSchema = new Schema({
    client_id: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'ID de usuario obligatorio.']},
    status: { type: String, required: true, default: 'processed', enum: validStatus},
    items: [
        {
            file_id: { type: Schema.Types.ObjectId, ref: 'File', required: true},
            quantity: {type: Number, default: 1, required: true },
            price: { type: Number, default: 1, required: true},
            name: { type: String }
        },
    ],
    created_at: { type: Number },
    modified_at: { type: Number },
    end_at: { type: Number, required: true },
    delivered: { type: Number },
    price: { type: Number, default: 1, required: true },
    partial_payment: { type: Number, default: 0 },
    shipping:{ type: Boolean, default: false, required: true },
    shipping_price:{ type: Number },
    branch_id: { type: String, required: true }
});

module.exports = mongoose.model('Order', OrderSchema);