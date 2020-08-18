var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');

exports.ensureAuth = function(req, res, next) {
    // console.log('Pasa por el ensureAuth');
    if(!req.headers.authorization) return res.status(401).send({ ok:false, message: 'Token necesario.'});
    var token = req.headers.authorization.replace(/['"]+/g, '');
    if (!token) {
        return res.status(401).send({ ok: false, message: 'No se recibió ningún token.'});
    }

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) return res.status(401).send({ ok:false, message: 'Token incorrecto.'});
        //Set user decoded to global request
        req.user = decoded.user;
        next();
    });

    
}