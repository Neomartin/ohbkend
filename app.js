'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var file_routes = require('./routes/file');
var order_routes = require('./routes/orders');
var branch_routes = require('./routes/branch');
// Remover*********
var private_routes = require('./routes/private');
// var product_routes = require('./Routes/product');
// var queja_routes = require('./routes/quejas');


//cargar middlewares
app.use(bodyParser.urlencoded({extended: true}));
/***  bodyParser.urlencoded([options])
Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option. This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.
A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).*/
app.use(bodyParser.json());

//cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});


//rutas
app.use('/api', [
				   user_routes, 
				   file_routes,
				   order_routes,
				   branch_routes,
				   // Remover ****
				   private_routes
				]);

//exportar
module.exports = app;