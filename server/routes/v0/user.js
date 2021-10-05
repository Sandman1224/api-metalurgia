const express = require('express')
const User = require('../../models/user')

const app = express()

app.get('/users', (req, res) => {
    let page = parseInt(req.query.page) || 0
    let limit = parseInt(req.query.limit) || 1

    const query = { status: { $gt: -1 } }

    User.find(query)
        .sort({ created: -1 })
        .skip(page * limit)
        .limit(limit)
        .exec((error, usersDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            User.countDocuments(query).exec((counterError, countDb) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    });
                }

                return res.json({
                    ok: true,
                    total: countDb,
                    page: page,
                    pageSize: usersDb.length,
                    data: usersDb
                })
            })
        })
})

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