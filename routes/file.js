'use strict'
var express = require('express');
var mdAuthentication = require('../middlewares/authentication').ensureAuth;
var fileController = require('../controllers/file');

var api = express.Router({ mergeParams: true });
// ===============================================
// Type Block                       				   
// ===============================================
api.post('/from/type', mdAuthentication, fileController.addType);
api.get('/from/type/:id?', mdAuthentication, fileController.getType);
api.delete('/from/type/:id', mdAuthentication, fileController.delType);
// ===============================================
// Career Block                       				   
// ===============================================
api.post('/from/career', fileController.addCareer); //add authentication
api.get('/from/career/:id?', fileController.getCareer); //add authentication
api.delete('/from/career/:id', fileController.delCareer); //add authentication
// ===============================================
// From Block                       				   
// ===============================================
api.post('/from', mdAuthentication, fileController.addFrom);
api.get('/from/:id?', mdAuthentication, fileController.getFrom);
api.delete('/from/:id', mdAuthentication, fileController.delFrom);
// ===============================================
// File Routes Block                       				   
// ===============================================
api.post('/file', fileController.addFile); //add authentication
api.get('/file', fileController.getFile); //add authentication


module.exports = api;