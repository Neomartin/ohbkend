'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var mdAuthentication = require('../middlewares/authentication').ensureAuth;

var api = express.Router();
//Definimos Rutas
api.post('/login', UserController.login);
api.post('/user', mdAuthentication, UserController.addUser);
api.post('/userdel/:id', mdAuthentication, UserController.delUser);
api.get('/user/:id?', mdAuthentication, UserController.getUsers); // mdAuthentication.ensureAuth
api.put('/user/:id', mdAuthentication, UserController.updUser);
api.delete('/user/:id', mdAuthentication, UserController.delUser);
api.put('/user/password/:id', mdAuthentication, UserController.updPassword);
api.get('/token/renew', mdAuthentication, UserController.renewToken );
api.get('/user/reset-password/:id', mdAuthentication, UserController.resetPassword);

module.exports = api;