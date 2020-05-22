'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var mdAuthentication = require('../middlewares/authentication');

var api = express.Router();
//Definimos Rutas
api.post('/login', UserController.login);
api.post('/user', UserController.addUser);
api.post('/userdel/:id', UserController.delUser);
api.get('/user/:id?', UserController.getUsers); // mdAuthentication.ensureAuth
api.put('/user/:id', UserController.updUser);
api.delete('/user/:id', UserController.delUser);
api.put('/user/password/:id', UserController.updPassword);

module.exports = api;