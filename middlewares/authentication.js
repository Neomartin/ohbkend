var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');

exports.ensureAuth = function(req, res, next) {
    if(!req.headers.authorization) return res.status(401).send({ ok:false, message: 'Token necesario.'});
    var token = req.headers.authorization.replace(/['"]+/g, '');
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) return res.status(401).send({ ok:false, message: 'Token incorrecto.'});
        //Set user decoded to global request
        req.user = decoded.user;
        next();
    });
}