'use strict'

var mongoose = require('mongoose');
var SEED = require('../config/config').SEED;
var moment = require('moment');

var from = require('../models/from');
var fromType = require('../models/from_types');
var Career = require('../models/career');
var File = require('../models/file');

// ===============================================
// From Block - Instituciones                       				   
// ===============================================
function addFrom (req, res) {
    var newFrom = new from(req.body);
    // newFrom.name = newFrom.name.toLowerCase();
    newFrom.save((err, from) => {
        if (err) return res.status(500).send({ ok: false, message: 'Error al agregar origen, ', err});
        return res.status(200).send({ ok: true, message: 'Origen agregado correctamente', saved: from});
    });
}
function getFrom (req, res) {
    // console.log('llamada realizada al getFrom');
    if(req.params.id) {
        from.findById(req.params.id).populate().exec((err, from) => {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener instituciones, ', err});
            if (!from) return res.status(404).send({ ok: false, message: 'No se encontraron instituciones'});
            return res.status(200).send({ ok: true, message: 'Instituciones obtenidas correctamente', from});
        })
    } else {
        from.find().populate('type_id').exec((err, from)=> {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener instituciones, ', err});
            if (!from) return res.status(404).send({ ok: false, message: 'No se encontraron instituciones'});
            return res.status(200).send({ ok: true, message: 'Instituciones obtenidas correctamente', from});
        });
    }
}
function delFrom (req, res) {
    var id = req.params.id;
    from.findByIdAndRemove(id, (err, deleted) => {
        if (err) return res.status(500).send({ok: false, message: 'Error borrar Institución.', err});
        if (!deleted) return res.status(400).send({ok: false, message: 'ID de institución incorrecto.'});
        return res.status(200).send({ok: true, deleted});
    });
}
// ===============================================
// Types Block - Tipos de Instituciones                     				   
// ===============================================
function addType(req, res) {
    console.log(req.body);
    var params = req.body;
    var type = new fromType({
        name: req.body.name,
        obs: req.body.obs
    });
    type.save((err, type)=> {
        if (err) return res.status(500).send({ ok: false, message: 'Error al agregar tipo de origen, ', err});
        return res.status(200).send({ ok: true, message: 'Tipo agregado correctamente', saved: type});
    });
}

function getType(req, res) {
    if(req.params.id) {
        fromType.findById(req.params.id).exec((err, types)=> {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener tipos de origen, ', err});
            return res.status(200).send({ ok: true, message: 'Origenes obtenidos satisfactoriamente.', types});
        });
    } else {
        fromType.find({}).exec((err, types)=> {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener tipos de origen, ', err});
            return res.status(200).send({ ok: true, message: 'Origenes obtenidos satisfactoriamente.', types});
        });
    }
}

function delType (req, res) {
    var id = req.params.id;
    fromType.findByIdAndRemove(id, (err, deleted) => {
        if (err) return res.status(500).send({ok: false, message: 'Error borrar Tipo', err});
        if (!deleted) return res.status(400).send({ok: false, message: 'No existe un Tipo con ese ID'});
        return res.status(200).send({ok: true, deleted});
    });
};

function addCareer (req, res) {
    var career = new Career(req.body);
    console.log('JS: ', Date.now());
    console.log('Moment: ', moment().unix());
    // return res.status(200).send({ok: true, message: 'Carrera agregada correctamente.'});
    
    career.save((err, saved)=> {
        if (err) return res.status(500).send({ok: false, message: 'Error interno no se pudo agregar carrera.'});
        if (!saved) return res.status(404).send({ok: false, message: 'No se guardo carrerar.'});
        return res.status(200).send({ok: true, message: 'Carrera agregada correctamente.', saved});
    })
    // var newFrom = new from(req.body);
    // // newFrom.name = newFrom.name.toLowerCase();
    // newFrom.save((err, from) => {
    //     if (err) return res.status(500).send({ ok: false, message: 'Error al agregar origen, ', err});
    //     return res.status(200).send({ ok: true, message: 'Origen agregado correctamente', saved: from});
    // });
}
function getCareer (req, res) {
    console.log(req.params);
    // console.log('llamada realizada al getFrom');
    // if(req.params.id) {
    //     from.findById(req.params.id).populate().exec((err, from) => {
    //         if (err) return res.status(500).send({ ok: false, message: 'Error al obtener instituciones, ', err});
    //         if (!from) return res.status(404).send({ ok: false, message: 'No se encontraron instituciones'});
    //         return res.status(200).send({ ok: true, message: 'Instituciones obtenidas correctamente', from});
    //     })
    // } else {
        Career.find().populate('from_id').exec((err, career)=> {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener carreras.', err});
            if (!from) return res.status(404).send({ ok: false, message: 'No se encontraron carreras.'});
            return res.status(200).send({ ok: true, message: 'Carreras obtenidas correctamente', career});
        });
    // }
}

function getCareerFrom (req, res) {
    var id = req.params.from;
    // console.log(id);
    Career.find({'from_id': id }).populate('from_id').exec((err, career)=> {
        if (err) return res.status(500).send({ ok: false, message: 'Error al obtener carreras de Institución.', err});
        if (!career) return res.status(404).send({ ok: false, message: 'No se encontraron carreras de Institución.'});
        return res.status(200).send({ ok: true, message: 'Carreras obtenidas correctamente', career});
    });
}

function delCareer (req, res) {
    // var id = req.params.id;
    // from.findByIdAndRemove(id, (err, deleted) => {
    //     if (err) return res.status(500).send({ok: false, message: 'Error borrar Institución.', err});
    //     if (!deleted) return res.status(400).send({ok: false, message: 'ID de institución incorrecto.'});
    //     return res.status(200).send({ok: true, deleted});
    // });
}

function addFile(req, res) {
    // {req.body.origin = [{
    //     from_id: '5d5f2140dd1b464350a49866',
    //     year: 'Primer',
    //     career_id: '5d5f5a66aca50a1d545d32bb'
    // }];}
    var file = new File(req.body);
    if(!req.body.career_id) req.body.career_id = null;
    file.crated_at = moment().unix()
    console.log(file);
    file.save((err, saved) => {
        if (err) return res.status(500).send({ok: false, message: 'Error al agregar archivo', err});
        if (!saved) return res.status(404).send({ok: false, message: 'No se pudo guardar el archivo, datos incorrectos'});
        return res.status(200).send({ok: true, message: 'Archivo creado correctamente', saved});
    })
    // return res.status(200).send({body: req.body});
}
function getFile(req, res) {
    if(req.params.id) {
        return res.status(200).send({ok: true, message: 'Entro a buscar por ID'}); 
    } else {
        File.find()
                    .populate('user_id', { password: 0, role: 0})
                    .populate({path: 'from_id'})
                    .populate({path: 'career_id'})
                    .exec((err, files) => {
            if (err) return res.status(500).send({ok: false, message: 'Error al obtener FILES', err});
            if (!files) return res.status(404).send({ok: false, message: 'No se pudieron obtener archivos'});
            return res.status(200).send({ok: true, message: 'Archivos obtenidos correctamente', files});
        })
    }
}

function deleteFile(req, res) {
    var id = req.params.id;
    if(id) {
        File.findByIdAndRemove( id, (err, deleted) => {
            if(err) return res.status(500).send({ ok: false, message: 'Error en al intentar eliminar el archivo.'});
            if(!deleted) return res.status(404).send({ ok: false, message: 'No se pudo eliminar el archivo específicado.'});
            return res.status(200).send({ ok: true, message: 'Archivo eliminado correctamente', deleted});
        });
    } else {
   return res.status(500).send({ ok: false, message: 'El ID es obligatorio.'});
    }     
}
module.exports = {
    addFrom,
    getFrom,
    delFrom,
    addType,
    getType,
    delType,
    addCareer,
    getCareer,
    delCareer,
    getCareerFrom,
    addFile,
    getFile,
    deleteFile
}