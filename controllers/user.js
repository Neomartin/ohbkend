'use strict'

var mongoose = require('mongoose');
var User = require('../models/user');
var SEED = require('../config/config').SEED;

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// ===============================================
// LOGIN Block                       				   
// ===============================================
function login(req, res) {
    var body = req.body;
    // console.log(body);
    if(body.username && body.password) {
        User.findOne({ username: body.username }, (err, user) => {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener usuario.' });
            if(!user) { return res.status(404).send({ ok: false, message: 'Error usuario no encontrado.' }); }
            if(!bcrypt.compareSync(body.password, user.password)) {
                return res.status(400).send({ ok: false, message: 'Error en los datos ingresados.' });
            }
            //Jwt
            user.password = undefined; //pass
            var token = jwt.sign( { user }, SEED, { expiresIn: 14400 })  //4 hours
            return res.status(200).send({   ok: true, 
                                            message: 'Login correcto',
                                            token: token,
                                            user    });
        })
    } else {
        return res.status(400).send({ ok: false, message: 'Todos los campos son obligatorios'});
    }
}

function addUser(req, res) {
    var user = new User(req.body);
    // console.log('Usuario:', user);
    if(user.password) {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) return res.status(500).send({ ok: false, message: 'Error al guardar usuario.' });
            user.password = hash;
        });
    }
    user.save((err, stored) => {
        if (err) return res.status(400).send({ok: false, message: 'Error al guardar usuario, error: ', error: err});
        if (stored) return res.status(200).send({ok: true, message: 'Usuario guardado correctamente.', stored});
    });
    // res.status(200).send({ ok: true, message: 'Usuario recibido', user: user});
}

// ===============================================
// GET USERS Block                       				   
// ===============================================
function getUsers(req, res) {
    console.log('Ingresa al Get');
    User.find({}, '-password').exec((err, users) => {
        if (err) return res.status(400).send({ok: false, message: 'Error al obtener usuarios, error: ', error: err});
        if (users) return res.status(200).send({ok: true, usuarios: users});
    });
    
}

// function register(req, res){
//     var user = new User();
//     var params = req.body;
//     user.name = params.name;
//     user.surname = params.surname;
//     params.email ? user.email = params.email.toLowerCase() : user.email = null;
//     user.dni = params.dni;
//     user.dir = params.dir;
//     user.dir_num = params.dir_num;
//     params.nick ? user.nick = params.nick.toLowerCase() : user.nick = null;
//     user.password = bcrypt.hashSync(params.password, 10);
//     params.image ? user.image=params.image : user.image=null; //ternario
//     if (params.role) user.role = params.role;
//     user.observation = params.observation;
//     user.smartphone = params.smartphone;
//     console.log(user);
    
//     if(user.name && user.surname && user.dni && user.password && user.email){
//         user.save( (err, userStored) => {
//             if(err) return res.status(400).send({ok: false, message: 'Error Server al guardar Usuario.', errorsito: err});
//             if(!userStored) return res.status(404).send({ok: false, message: 'No se registro el usuario.', errorsito: err})
            
//             if (userStored) return res.status(200).send({ok: true, message: 'Usuario guardado correctamente.', User: userStored });
//         })
//     } else {
//         return res.status(401).send({ok: false, message: 'Se necesitan que se completen los campos obligatorios.'});
//     }
//     // console.log(user);  
// }

// function login(req, res) {
//     var login = new User(req.body);
//     if(login.email && login.password || login.dni && login.password) {
//         User.findOne({
//                 $or: [
//                     { email: login.email },
//                     { dni: login.dni }
//                 ],
//         }).select({ nick: 0, observation: 0 }).exec((err, userLogin)=> {
//             if(err) return res.status(500).send({ ok: false, message: 'Error al realizar la petición al servidor.'});
//             if(!userLogin) return res.status(404).send({ ok: false, message: 'Usuario no encontrado.'});
            
//             if(bcrypt.compareSync(login.password, userLogin.password)) {
//                 console.log(SEED);
//                 userLogin.password = undefined;
//                 var token = jwt.sign( { usuario: userLogin }, SEED, { expiresIn: 14400 });
//                 return res.status(200).send({ ok: true, message: 'Usuario encontrado.', user: userLogin, token: token });
//             } else {
//                 console.log('NO Ingresa Login');
//                 return res.status(404).send({ ok: false, message: 'Usuario o Contraseña incorrecta.'})
//             }
//         })
//     }

// }


module.exports = {
    addUser,
    getUsers,
    login
}