
'use strict'
var express = require('express');
var api = express.Router();
var orderController = require('../controllers/orders');


api.post('/order', orderController.addOrder);
api.get('/order/:id?', orderController.getOrder);
api.delete('/order/id', orderController.delOrder);



module.exports = api;