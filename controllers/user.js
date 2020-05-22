'use strict'

var mongoose = require('mongoose');
var User = require('../models/user');
var Order = require('../models/order');
var SEED = require('../config/config').SEED;

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
// var deletedUser = 'holis';
var deletedUser = '5ec47a7231f3ce0abc4c2d7a';
var salt = 10;
// ===============================================
// LOGIN Block                       				   
// ===============================================
function login(req, res) {
    
    // console.log('Bady', body);
    var body = new User();
    body.username = req.body.user.toLowerCase();
    body.password = req.body.password;
    // console.log('After bady', body);
    
    if(body.username && body.password) {
        User.findOne({
            $or: [
                { username: body.username },
                { email: body.username }
            ]
        }, (err, user) => {
            if (err) return res.status(500).send({ ok: false, message: 'Error al obtener usuario.' });
            if(!user) { return res.status(404).send({ ok: false, message: 'Error usuario no encontrado.' }); }
            
            bcrypt.compare(body.password, user.password, (err, result)=> {
                if (result) {
                    //Jwt
                    user.password = undefined; //pass
                    // console.log('Result:', result);
                    var token = jwt.sign( { user }, SEED, { expiresIn: 1994400 })  //4 hours
                    user.token = token;
                    console.log('Token:', user);
                    req.user = user;
                    req.user.token = token;
                    console.log('ReqUser:', req.user);
                    // console.log('ReqUser + Token:', req.user);
                    return res.status(200).send({   ok: true, 
                                                    message: 'Login correcto',
                                                    token: token,
                                                    user: req.user    });
                } else {
                    return res.status(404).send({ ok: false, message: 'Datos ingresados incorrectos'});
                }
            });
            
        })
    } else {
        return res.status(400).send({ ok: false, message: 'Todos los campos son obligatorios'});
    }
}

function addUser(req, res) {
    console.log('Body: ', req.body);
    var user = new User(req.body);
    // Armando nombre usuario default por si no es enviado
    var dateString = Date.now().toString();
    console.log('Name Editadito Finalmente: ', user.name.split(' ')[0].toLowerCase() + dateString.slice(9));
    user.username ? user.username.toLowerCase() : user.username = user.name.split(' ')[0].toLowerCase() + dateString.slice(9);
    user.email ? user.email = user.email.toLowerCase() : user.email = undefined; 
    console.log('User: ', user);
    // console.log('Usuario:', user);
    if(user.password) {
        console.log('BeforePass: ', user);
        bcrypt.hash(user.password, salt, (err, hash) => {
            console.log('Hash: ', hash);
            // console.log('Error:', err );
            if (err) return res.status(500).send({ ok: false, errorsito: err, message: 'Error al guardar usuario.' });
            // if (err) return res.status(500).send({ ok: false, errorsito: err, message: 'Error al guardar usuario.' });
            user.password = hash;
            user.save((err, stored) => {
                console.log('Stored: ', stored);
                if (err) return res.status(500).send({ok: false, message: 'Error al guardar usuario, error: ', error: err});
                if (!stored) return res.status(404).send({ok: false, message: 'El usuario no fue cargado revise los datos ingresados'});
                return res.status(200).send({ok: true, message: 'Usuario guardado correctamente.', stored});
            });
        });
    } else {
        console.log('User2: ', user);
        user.save((err, stored) => {
            console.log('Stored Normal: ', user);
            if (err) return res.status(500).send({ok: false, message: 'Error al guardar usuario, error: ', error: err});
            if (!stored) return res.status(404).send({ok: false, message: 'El usuario no fue cargado revise los datos ingresados'});
            return res.status(200).send({ok: true, message: 'Usuario guardado correctamente.', stored});
        });
    }
    
    // res.status(200).send({ ok: true, message: 'Usuario recibido', user: user});
}

// ===============================================
// GET USERS Block                       				   
// ===============================================
function getUsers(req, res) {
    var id = req.params.id;
    if(id) {
        User.findOne({ '_id': id})
            .populate('branch')
            .exec( (err, user) => {
                if (err) return res.status(500).send({ ok: false, message: 'Error al obtener usuario.'});
                if (!user) return res.status(404).send({ ok: false, message: 'Error en los datos para obtener usuario.'});
                return res.status(200).send({ ok: true, message: 'Usuario encontrado', user});
        });
    } else {
        console.log('Ingresa al Get');
        User.find({ _id: { $ne: deletedUser } }, '-password')
            .exec((err, users) => {
                if (err) return res.status(400).send({ok: false, message: 'Error al obtener usuarios, error: ', error: err});
                if (users) return res.status(200).send({ok: true, users: users});
        });
    }
    
}

function updUser(req, res) {
    var id = req.params.id;
    var user = new User();
    user = req.body;
    console.log('Body update user: ', req.body);
    if(id) {
        console.log('Entra al IF');
        User.findOneAndUpdate({_id: id}, user, {new: true},  (err, updated) => {
            if(err) return res.status(500).send({ ok: false, message: err});
            if(!updated) return res.status(404).send({ ok: false, message: 'Error en datos para actualizar usuario.'});
            return res.status(200).send({ ok: true, message: 'Usuario actualizado correctamente', updated: updated});
        });
    } else {

    }
}


function delUser(req, res) {
    var id = req.params.id;
    if(id) {
        // console.log('id para el delete fdd:', id);
        // Order.find({ 'client_id': id}, (err, encontrado)=> {
        //     return res.status(200).send({ok: true, message: 'Ordenes encontradas', encontrado})
        // })
        
        delAndSetuser(id)
            .then( (resp) => {
                console.log('resp recibida');
                console.log(resp);
                return res.status(200).send({ ok: true, message: 'Actualizado correctamente', await: resp });
            })
            .catch((err) => {
                console.log(err);     
            })
    } else {
        return res.status(400).send({ ok: false, message: 'Debe proporcionar un ID.', err})
    }
}
async function delAndSetuser(id) {
    console.log('Entra al async await');
    var deleted = await User.findByIdAndRemove(id, (err, deleted)=> {
        if (err) return { ok: false, message: 'Error al BORRAR Usuario', err};
        if (!deleted) return { ok:false, message: 'No se pudo borrar Usuario con este ID.'};
        return { ok: true, message: 'Usuario borrado CORRECTAMENTE', deleted};
    });

    var updated = await Order.update({ 'client_id': id}, { 'client_id': deletedUser }, { multi: true}, (err, updated)=> {
        if(!updated) return { ok: false, message: 'No se actualizdo'};
        return { ok: true, message: 'Holas se actualziado', updated};
    });
    return {
        deleted,
        updated
    }
}

function updPassword(req, res) {
    var id = req.params.id;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    if(oldPassword === newPassword) {
        return res.status(401).send({ ok: false, message: 'La contraseñas debe ser diferente a la anterior'});
    }
    // console.log('ReqBody', req.body);
    // console.log('ReqParams', req.params);
    if(oldPassword && newPassword) {
        // console.log('Entra');
        User.findById(id, (err, userFinded) =>  {
            if (err) return res.status(500).send({ ok: false, message: 'Error en el servidor al obtener usuario con este ID'});
            if (!userFinded) return res.status(404).send({ ok: false, message: 'Usuario no encontrado.'});
            // console.log('User from db:', userFinded);
            bcrypt.compare(oldPassword, userFinded.password, (err, decrypted) => {
                if (err) return res.status(500).send({ ok: false, message: 'Error al modificar contraseña.'});
                if(decrypted) {
                   bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) return res.status(500).send({ ok: false, errorsito: err, message: 'Error al modificar contraseña.', error: err });
                    userFinded.password = hash;
                    User.findOneAndUpdate({_id: id}, {password: hash}, {new: true}, (err, stored) => {
                        if (err) return res.status(500).send({ok: false, message: 'Error al modificar contraseña.', error: err});
                        if (!stored) return res.status(404).send({ok: false, message: 'No se pudo modificar la contraseña o/.'});
                        stored.password = undefined;
                        return res.status(200).send({ok: true, message: 'Contraseña modificada correctamente', stored});
                    })
                   })
                } else {
                    return res.status(400).send({ ok: false, message: 'Los datos ingresados no son correctos'});
                }
            })
        })
    } else {
        return res.status(404).send({ ok: false, message: 'Datos incompletos.'});
    }
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
    updUser,
    delUser,
    login,
    updPassword
}