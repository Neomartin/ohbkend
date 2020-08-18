
'use strict'
var express = require('express');
var api = express.Router();
var orderController = require('../controllers/orders');
var mdAuthentication = require('../middlewares/authentication').ensureAuth;


api.post('/order', orderController.addOrder);
api.post('/orders/:branch', orderController.getOrders); //Obtener todas las ordenes por método post y por filtro
api.get('/order/:branch/:id?', mdAuthentication, orderController.getOrder);
api.delete('/order/id', orderController.delOrder);
api.put('/order/:id/:status?/:limit?', orderController.updOrder );


module.exports = api;