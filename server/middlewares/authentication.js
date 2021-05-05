const jwt = require('jsonwebtoken');

// ====================
// Verificar token
// ====================
let checkToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if (error) {
            return req.status(401).json({
                ok: false,
                error: {
                    message: 'Token is not valid.'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
}

module.exports = {
    checkToken
}