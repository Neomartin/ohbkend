'use strict'

var express = require('express');
var Branch = require('../models/branch');
var SEED = require('../config/config').SEED;

function addBranch(req, res) {
    var branch = new Branch(req.body);
    console.log('branch');
    console.log(branch);
    // return res.status(200).send({ ok: true, message: 'Response from branch POST'});
    branch.save((err, saved) => {
        if(err) return res.status(500).send({ ok: false, message: 'Error interno', err});
        if(!saved) return res.status(404).send({ ok: false, message: 'No se pudo añadir la Sucursal, asegurese de que todos los datos ingresados son correctos.'});
        return res.status(200).send({ ok: true, message: 'Gardarajado', saved: saved });
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
}

function delBranch(req, res) {
    var id = req.params.id;
    Branch.findByIdAndRemove(id, (err, deleted) => {
        if(err) return res.status(500).send({ ok: false, message: 'Error interno al eliminar Sucursal'});
        if(!deleted) return res.status(404).send({ ok: false, message: 'No se pudo eliminar este registro.'});

        return res.status(200).send({ ok: true, message: 'Sucursal eliminada correctamente', deleted: deleted});
    });
}

function updBranch(req, res) {
    var id = req.params.id;
    var branch = new Branch();
    branch = req.body;
    // return res.status(200).send({ ok: true, message: 'Response from branch POST'});
    Branch.findOneAndUpdate( {_id: id}, branch, { new: true }, (err, updated) => {
        if(err) return res.status(500).send({ ok: false, message: 'Error al actualizar sucursal.', err: err});
        if(!updated) return res.status(404).send({ ok: false, message: 'Error en datos no se pudo actualizar.'});
        return res.status(200).send({ ok: true, message: 'Sucursal Actualizada correctamente!!', updated: updated});
    });       
}

function getBranch(req, res) {
    var id = req.params.id;
    if(id) {
        Branch.findOne({ _id: id }, (err, branch) => {
            if(err) return res.status(500).send({ ok: false, message: 'No se pudo realizar busqueda.'});
            if(!branch) return res.status(404).send({ ok: false, message: 'Sucursal no encontrada.'});
            return res.status(200).send({ ok: true, message: 'Sucursal encontrada', branch: branch});
        })
    } else {
        Branch.find((err, branches) => {
            if(err) return res.status(500).send({ ok: false, message: 'Error al obtener sucursales.'});
            if(!branches) return res.status(404).send({ ok: false, message: 'No existen sucursales por el momento.'});
            console.log(branches.length);
            return res.status(200).send({ ok: true, message: 'Sucursales encontradas', branch: branches});
        });
    }
}


module.exports = {
    addBranch,
    getBranch,
    delBranch,
    updBranch
}