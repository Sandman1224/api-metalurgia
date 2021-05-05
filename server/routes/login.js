const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({status: 1, dni: body.dni}, (error, userDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Dni does not correct.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDb.password)) {
            return res.status(400).json({
                of: false,
                error: {
                    message: 'Password does not correct.'
                }
            })
        }

        let token = jwt.sign({
            user: userDb,
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            userData: userDb,
            token
        })
    });
});

module.exports = app;