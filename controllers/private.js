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

module.exports = {
    setBranches
}