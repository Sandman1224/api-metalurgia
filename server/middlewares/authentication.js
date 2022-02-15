const jwt = require('jsonwebtoken');

// ====================
// Verificar token
// ====================
let checkToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({
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

const checkAppToken = (req, res, next) => {
    const token = req.get('accessToken')

    jwt.verify(token, process.env.JWTKEY, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Token is not valid.'
                }
            });
        }

        if (decoded && decoded.apiToken === process.env.APPSEED) {
            next();
        }
    })
}

module.exports = {
    checkToken,
    checkAppToken
}