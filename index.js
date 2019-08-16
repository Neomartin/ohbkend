'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//Conexion a la Base de Datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://neotech:Neito1987!@ohana-z8v9j.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
                .then(()=> {
                    console.log('Connection to \x1b[36mDATABASE Successful!! \x1b[37m');
                    //Crear servidor
                    app.listen(port, () => {
                        console.log('Servidor Express running on \x1b[33m http://localhost:' + port +' \x1b[37m');
                    })
                })
                .catch(err => {
                    console.log('\x1b[31m Error connecting to DB \x1b[37m :', err);
                });
                