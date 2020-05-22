'use strict'

var express = require('express');
var branchController = require('../controllers/branch');
var mdAuthentication = require('../middlewares/authentication');

var api = express.Router();

// Crear sucursal
api.post('/branch', branchController.addBranch);
api.get('/branch/:id?', branchController.getBranch);
api.put('/branch/:id', branchController.updBranch);
api.delete('/branch/:id', branchController.delBranch);

module.exports = api;