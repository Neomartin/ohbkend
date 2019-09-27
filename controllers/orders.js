'use strict'

var mongoose = require('mongoose');
// var SEED = require('../config/config').SEED;
var moment = require('moment');

var Order = require('../models/order');



function addOrder(req, res) {
    
    var order = new Order(req.body);
    order.created_at = moment().unix();
    order.end_at ? order.end_at : order.end_at = moment().add(1, 'd').unix();
    order.items = [
        { 
            file_id: '5d60a5fd884e6b04741ead96',
            quantity: 2,
            price: 120
        },
        {
            file_id: '5d61c8f343bd810d480023f8',
            quantity: 1,
            price: 192
        }
    ];
    // console.log(req.body);
    order.save((err, saved)=> {
        if (err) return res.status(500).send({ ok: false, message: 'Error al guardar archivo', err})
        if (!saved) return res.status(400).send({ ok: false, message: 'Error en los datos ingresados'})
        return res.status(200).send({ ok: true, message: 'Orden guardada Correctamente.', saved})
    })
    // return res.status(200).send({ ok: true, message: 'Holas desde Orders POST.', order})
}
function getOrder(req, res) {
    var id = req.params.id;
    if(id) {
        Order.findById(id, (err, order)=> {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener orden', err})
            if (!order) return res.status(404).send({ ok: false, message: 'No se encontro ORDEN con este ID.'})
            return res.status(200).send({ ok: true, message: 'Orden con ID obtenida correctamente', order})
        })
    } else {
        Order.find()
             .sort('end_at')
             .populate('client_id', 'name surname _id')
             .populate('items.file_id', '_id name')
             .exec((err, order)=> {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener ordenes', err})
            if (!order) return res.status(404).send({ ok: false, message: 'No se obtuvieron ORDENES.'})
            return res.status(200).send({ ok: true, message: 'Ordenes OBTENIDAS', order})
        });
    }
} //getorder
function delOrder(req, res) {
    var id = req.params.id;
    if(id) {
        Order.findByIdAndRemove(id, (err, deleted)=> {
            if (err) return res.status(500).send({ ok: false, message: 'Error al BORRAR ORDEN', err})
            if (!deleted) return res.status(404).send({ ok: false, message: 'No se pudo borrar orden con este ID.'})
            return res.status(200).send({ ok: true, message: 'ORDEN BORRADA CORRECTAMENTE', deleted})
        })
    } else {
        return res.status(400).send({ ok: false, message: 'Debe proporcionar un ID.', err})
    }
}
function updOrder(req, res) {
    return res.status(200).send({ ok: true, message: 'Holas desde orders UPDATE.'})
}


module.exports = {
    addOrder,
    getOrder,
    delOrder,
    updOrder
}