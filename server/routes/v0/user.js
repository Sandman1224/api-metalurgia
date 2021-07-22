const express = require('express')
const User = require('../../models/user')

const app = express()

/**
 * Buscar un usuario por "Id"
 */
app.get('/user/:id', (req, res) => {
    let employeeId = req.params.id

    User.findOne({ employeeId, status: 1 }, (error, userDb) => {
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
                    message: 'Employee Id does not correct.'
                }
            });
        }

        res.json({
            ok: true,
            user: userDb
        })
    })
})

module.exports = app;