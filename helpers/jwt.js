const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

const createJWT = (user) => {

        return new Promise( (resolve, reject) => {
            const payload = {
                user,
            };

            jwt.sign(payload, SEED, {
                expiresIn: '12h'
            }, (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el JWT')
                } else {
                    // console.log('Token from creatJWT', token);
                    resolve(token);
                }
            })
        })
}

module.exports = {
    createJWT
};