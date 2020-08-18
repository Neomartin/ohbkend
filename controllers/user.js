'use strict'

var mongoose = require('mongoose');
var User = require('../models/user');
var Order = require('../models/order');
var SEED = require('../config/config').SEED;

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var createToken = require('../helpers/jwt');
// var deletedUser = 'holis';
var deletedUser = '5ec47a7231f3ce0abc4c2d7a';
var salt = 10;
var roles = [ 'CLIENT_ROLE', 'USER_ROLE', 'ADMIN_ROLE', 'SUPER_ADMIN_ROLE' ];
// ===============================================
// LOGIN Block                       				   
// ===============================================
function login(req, res) {
    
    // try {
        console.log('Bady', body);
        var body = new User();
        body.username = req.body.user.toLowerCase() || '';
        body.password = req.body.password;
        // console.log('After bady', body);

        if (body.username && body.password) {
            User.findOne({
                $or: [
                    { username: body.username },
                    { email: body.username }
                ]
            })
            .populate('branch')
            .exec((err, user) => {
                if (err) return res.status(500).send({ ok: false, message: 'Error al obtener usuario.' });
                if(!user) { return res.status(404).send({ ok: false, message: 'Error usuario no encontrado.' }); }

                /////////////////////////////////////
                //   Comprobación del password    //
                ////////////////////////////////////
                bcrypt.compare(body.password, user.password, (err, result)=> {
                    if (result) {
                        
                        user.password = undefined; //pass

                        req.user = user;
                        ///////////////////////////////
                        // Generación del JWT        //
                        ///////////////////////////////
                        createToken.createJWT(user).then( token => {
                            // console.log('tokencito', token);
                            return res.status(200).send({   ok: true, 
                                message: 'Login correcto',
                                token: token,
                                user: req.user    
                            });
                        }).catch(err => {
                            return res.status(500).send({ ok: false, message: 'Internal error JWT'});
                        });
                        // console.log('DSADs', await createToken.createJWT(user));
                        
                    } else {
                        console.log('Error en contraseña');
                        return res.status(404).send({ ok: false, message: 'Datos ingresados son incorrectos'});
                    }
                });
            });
            
    } else {
        return res.status(400).send({ ok: false, message: 'Todos los campos son obligatorios'});
    }
    // } catch (error) {
    //     res.status(500).json({
    //                 ok: false,
    //                 msg: 'Hable con el administrador'
    //             })
    // }
   
}

function addUser(req, res) {
    // console.log('Body: ', req.body);
    var user = new User(req.body);
    // Armando nombre usuario default por si no es enviado
    var dateString = Date.now().toString();
    // console.log('Name Editadito Finalmente: ', user.name.split(' ')[0].toLowerCase() + dateString.slice(9));
    user.username ? user.username.toLowerCase() : user.username = user.name.split(' ')[0].toLowerCase() + dateString.slice(9);
    user.email ? user.email = user.email.toLowerCase() : user.email = undefined; 
    // console.log('User: ', user);
    // console.log('Usuario:', user);
    if(user.password) {
        // console.log('BeforePass: ', user);
        bcrypt.hash(user.password, salt, (err, hash) => {
            // console.log('Hash: ', hash);
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
        // console.log('User2: ', user);
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
    var access_level = req.user.role.access_level;
    // console.log('User', req.user);
    var id = req.params.id;
    console.log('Params', id);
    access_level === 4 || access_level === 0 ? access_level : access_level = access_level - 1;
    // if (access_level) {
    //     console.log('Entra al', );
    // }
    if(id) {
        User.findOne( { 
            $and: [
                // { 'role.access_level' : { $lte : access_level } },
                { '_id': id }
              ]
            })
            .populate('branch')
            .exec( (err, user) => {
                if (err) return res.status(500).send({ ok: false, message: 'Error al obtener usuario.'});
                if (!user) return res.status(404).send({ ok: false, message: 'Error en los datos para obtener usuario.'});
                return res.status(200).send({ ok: true, message: 'Usuario encontrado', user});
        });
    } else {
        User.find({
            $or: [{
                $and: [
                    { 'role.access_level' : { $lte : access_level }},
                    { _id : { $ne: deletedUser }},
                ]
                },
                { _id : req.user._id }
              ]
            })
            .exec((err, users) => {
                if (err) return res.status(400).send({ok: false, message: 'Error al obtener usuarios, error: ', error: err});
                if (users) return res.status(200).send({ok: true, users: users});
        });
    }
}

function updUser(req, res) {
    // Nivel de acceso del usuario actual
    var access_level = req.user.role.access_level;
    var id = req.params.id;
    var user = new User();
    console.log(user);

    user = req.body;
    // SEGURITY: User access modification check
    // **PD: To improve if requirements change, maximun access can be 1 level less than user access_level
    if(user.role.access_level <= access_level) {
        if(user.email) {
            console.log('Entra el user email')
            user.email = user.email.toLowerCase();
        } else {
            console.log('Entra al emal Undefined')
            user.email = undefined; 
        }
        // return res.status(404).send({ ok: true, message: 'Error hardcodeado'});
        // console.log('Body update user: ', req.body);
        if(id) {
            console.log('Entra al IF');
            User.findOneAndUpdate({_id: id}, user, {new: true})
            .populate('branch')
            .exec((err, updated) => {
                if(err) return res.status(500).send({ ok: false, message: err});
                if(!updated) return res.status(404).send({ ok: false, message: 'Error en datos para actualizar usuario.'});
                return res.status(200).send({ ok: true, message: 'Usuario actualizado correctamente', updated: updated});
            });
        } else {
    
        }
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
    console.log('PasswordOld: ', oldPassword);
    console.log('PasswordNew: ', newPassword);

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
            console.log('User from db:', userFinded);
            bcrypt.compare(oldPassword, userFinded.password, (err, decrypted) => {
                if (err) return res.status(500).send({ ok: false, message: 'Error al modificar contraseña.'});
                console.log('Decrypted: ' , decrypted);
                if(decrypted) {
                   bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) return res.status(500).send({ ok: false, errorsito: err, message: 'Error al modificar contraseña.', error: err });
                    console.log(hash);
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

 const renewToken = async(req, res) => {
     var user = req.user;

     const token = await createToken.createJWT(user);
    //  console.log('Token', token);
     return res.status(200).send({ ok: true, message: 'Token renovado', token});

 }

function resetPassword(req, res) {
    var id = req.params.id;
    if(req.user.role.access_level >= 3 || req.user._id === id) {
        bcrypt.hash('1234', salt, (err, hash)=> {
            if (err) return res.status(500).send({ ok: false, errorsito: err, message: 'Error al resetear contraseña.' });
            User.findOneAndUpdate({ _id: id}, { password: hash}, { new: true }, (err, updated) => {
                if(err) return res.status(500).send({ ok: false, message: err});
                if(!updated) return res.status(404).send({ ok: false, message: 'Datos incorrectos.'});
                return res.status(200).send({ ok: true, message: 'Contraseña reseteada correctamente', password: '1234', updated});
            })
        })
    } else {
        return res.status(403).send({ ok: false, message: 'No tiene permisos para realizar esta acción'});
    }
}

module.exports = {
    addUser,
    getUsers,
    updUser,
    delUser,
    login,
    updPassword,
    renewToken,
    resetPassword
}