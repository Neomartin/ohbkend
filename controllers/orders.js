'use strict'

var mongoose = require('mongoose');
// var SEED = require('../config/config').SEED;
var moment = require('moment');

var Order = require('../models/order');

function addOrder(req, res) {
    var order = new Order(req.body);
    order.created_at = moment().unix();
    // order.end_at ? order.end_at : order.end_at = moment().add(1, 'd').unix();
    // console.log(req.body);
    order.save((err, saved) => {
        if (err) return res.status(500).send({ ok: false, message: 'Error al guardar archivo', err})
        if (!saved) return res.status(400).send({ ok: false, message: 'Error en los datos ingresados'})
        console.log('Saved', saved);
        Order.populate(saved, 'client_id' , (err, saved2) => {
            console.log('Save2', saved2);
            return res.status(200).send({ ok: true, message: 'Orden guardada Correctamente.', saved2});
        });
    })
    // return res.status(200).send({ ok: true, message: 'Holas desde Orders POST.', order})
}
function getOrder(req, res) {
    // console.log(req.user);
    // console.log('Index del user Role: ', roles.indexOf(req.user.role));
    
    var id = req.params.id;
    var branch = req.params.branch;
    // console.log('Branch', branch);
    var dayAtStart = moment().unix() - ((moment().unix() / 3600)%24)*3600;
    // console.log('Ahora: ', now);

    // var today = (now / 3600)%24;
    // console.log('Horas: ', today);

    // var faltante = (24 - today);
    // console.log('Numero a restar:', faltante);
    
    // var momento = now + (faltante * 3600)
    // console.log('Momento', momento);

    // var remanente = (momento/3600)%24;
    // console.log('Recalculado resto: ', remanente);

    // var recalculated = momento - now;
    // console.log('Recalculated: ', recalculated);

    // var diff = (momento - now)/3600;
    // console.log('Diff: ', diff);

    // var startDay = now - (today*3600);
    // console.log('StartDay: ', startDay);

    if(id) {
        Order.findById(id)
            .sort([['status', -1]])
            .populate('client_id', 'name surname _id phone email dir dir_num departament')
            .populate('items.file_id', '_id name')
            .exec((err, order)=> {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener orden', err})
            if (!order) return res.status(404).send({ ok: false, message: 'No se encontro ORDEN con este ID.'})
            return res.status(200).send({ ok: true, message: 'Orden con ID obtenida correctamente', order})
        })
    } else {
        Order.find({
            $or: [
                {   
                    $and: [
                        {'status': { $nin: ['delivered']}},
                        {'end_at': { $gte: dayAtStart },},
                        {'branch_id' : branch }
                    ]
                },
                {
                    $and: [
                        {'status': {$in: [ 'in_progress', 'processed' ]}},
                        {'branch_id' : branch }
                    ]
                }
                
                ]
            })
             .sort([['status', -1]])
             .populate('client_id', 'name surname _id phone email dir dir_num departament')
             .populate('items.file_id', '_id name')
             .lean()
             .exec((err, order)=> {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener ordenes', err})
            if (!order) return res.status(404).send({ ok: false, message: 'No se obtuvieron ORDENES.'})
            Order.countDocuments({}, (error, count) => {
                return res.status(200).send({ ok: true, 
                                              message: 'Ordenes OBTENIDAS', 
                                              order,
                                              total: count })
            })
        });
    } 
} //getorder

function getOrders(req, res) {
    var branch = req.params.branch;
        Order.find({ 'branch_id' : branch })
        // Order by last modification date
        .sort([['modified_at', -1]])
        .populate('client_id', 'name surname _id phone email dir dir_num departament')
        .populate('items.file_id', '_id name')
        .exec((err, order)=> {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener ordenes', err})
            if (!order) return res.status(404).send({ ok: false, message: 'No se obtuvieron ORDENES.'})
            return res.status(200).send({ ok: true, message: 'Ordenes OBTENIDAS', order})
        });
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
    var id = req.params.id;
    var obs = req.body.obs;
    // console.log('BODY', req.body);
    var modified = moment().unix();
    var status = req.params.status;
    if(req.params.id && req.body) {
        var order = new Order();
        order = req.body;
        delete order._id;
        order.modified_at = modified;
    } else {
        var order = undefined;
    }

    if(status === 'cancelled') {
        console.log('Entra al cancelled if');
        if(obs) {
            console.log('Entra al cancelled if OBSETRVACTIOn');
            Order.findOneAndUpdate({ _id: id }, { '$set':{'status': status,  'modified_at': modified, 'obs' : obs }}, 
                                   { new: true }, (err, updated) => {
                    if(err) return res.status(500).send({ ok: false, message: 'Error al cancelar orden'});
                    if(!updated) return res.status(404).send({ ok: false, message: 'No puede cancelar esta orden'});
                    return res.status(200).send({ ok: true, message: 'Orden cancelada correctamente!', updated});
            });
        } else {    
            return res.status(404).send({ ok: false, message: 'Se debe especificar una observación'});
        }
    } else if (status && status !== 'delivered' && id) {
        console.log('Entra al Status updater');
        Order.findOneAndUpdate({ _id: id }, { '$set':{'status': status,  'modified_at': modified }}, {new: true }, (err, updated) => {
            if (err) return res.status(500).send({ ok: false, message: 'Error al actualizar orden STATUS', err});
            if(!updated) return res.status(404).send({ ok: false, message: 'Datos incorrectos no se actualizó la orden.'});
            return res.status(200).send({ ok: true, message: 'UPDATE STATUS Correcto.', updated: updated })
        });
    } else if (status === 'delivered' && id) {
        console.log('Entra al delivered');
        Order.findOneAndUpdate({ _id: id }, { '$set': {'status': status, 'delivered': moment().unix()} }, {new: true }, (err, updated) => {
            if (err) return res.status(500).send({ ok: false, message: 'Error al actualizar orden Entregada', err});
            if(!updated) return res.status(404).send({ ok: false, message: 'Datos incorrectos no se actualizó la orden a Entregada.'});
            return res.status(200).send({ ok: true, message: 'UPDATE ENTREGADA Correcto.', updated: updated })
        });
    } else {
        console.log('Entra al update Copado');
        console.log('ORDEN EN EL ELSE: ', order);
        Order.findOneAndUpdate({ _id: id }, order, {new: true })
                .populate('client_id', 'name surname _id phone email')
                .populate('items.file_id', '_id name')
                .exec((err, updated) => {
                    if (err) return res.status(500).send({ ok: false, message: 'Error al actualizar orden', err});
                    if(!updated) return res.status(404).send({ ok: false, message: 'Datos incorrectos no se actualizó la orden.'});
                    return res.status(200).send({ ok: true, message: 'UPDATE FULL Correcto.', updated: updated })
                });
    }

   
    // return res.status(500).send({ ok: false, message: 'Error en el update'});
}


module.exports = {
    addOrder,
    getOrder,
    getOrders,
    delOrder,
    updOrder,
}