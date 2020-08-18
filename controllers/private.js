'use strict'

var mongoose = require('mongoose');
// var SEED = require('../config/config').SEED;
var moment = require('moment');
var User = require('../models/user');

function setBranches(req, res) {
    console.log('llamado a private set branches');
    User.update({}, { 'branch': '5ebc783293b70c383028a25d'}, {multi:true}, (err, updated)=>{
        return res.status(200).send({ ok: true, message: 'updted', updated});
    }); 
}

function updUser(req, res) {
    console.log('Llamado a private update users Roles');
    User.find({ }, (err, users) => {
        console.log(users);
        console.log('Length: ', users.length);
    });
    User.updateMany({}, {'$set': { role: { name: 'CLIENT_ROLE', access_level: 0, viewValue: 'Cliente' }}}, (err, updated) => {

        if (err) return res.status(500).send({ ok: false, message: 'Error al obtener usuarios', err});
        if (!updated ) return res.status(404).send({ ok: false, message: 'Error al actualizar usuarios'});
        return res.status(200).send({ ok: true, message: 'Hola Private User', updated});
    });
}

module.exports = {
    setBranches,
    updUser
}