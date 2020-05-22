'use strict'
var express = require('express');
var privateController = require('../controllers/private');

var api = express.Router();

api.post('/private/userbranch', privateController.setBranches);

module.exports = api;
