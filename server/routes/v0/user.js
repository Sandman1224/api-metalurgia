const express = require('express')
const bcrypt = require('bcrypt');
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

app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId

    if (!userId) {
        return res.status(500).json({
            ok: false,
            error: {
                message: 'The required params are invalid.'
            }
        });
    }

    User.findById(userId, (error, userDb) => {
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
                    message: 'Required data does not exists.'
                }
            });
        }

        res.json({
            ok: true,
            data: userDb
        })
    })
})

/**
 * Buscar un usuario activo por "employeeId"
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

app.put('/user', (req, res) => {
    let body = req.body

    body.password = bcrypt.hashSync(body.password, 10)

    let userModel = new User(body)
    userModel.save((error, userDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        res.status(201).json({
            ok: true,
            data: userDb
        })
    })
})

/**
 * Editar un usuario por Id
 */
app.post('/users/:userId', (req, res) => {
    const userId = req.params.userId
    const userDataToUpdate = req.body

    if (!userId) {
        return res.status(500).json({
            ok: false,
            error: {
                message: 'The required params are invalid.'
            }
        });
    }

    if (userDataToUpdate.password) { // Si se editó el password lo encriptamos
        userDataToUpdate.password = bcrypt.hashSync(userDataToUpdate.password, 10)
    }

    User.findByIdAndUpdate(userId, { $set: userDataToUpdate }, { runValidators: true, context: 'query' }, (error, userDb) => {
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
                    message: 'Can not find required user to update.'
                }
            });
        }

        res.json({
            ok: true,
            data: userDb
        })
    })
})

/**
 * Setear el estado del usuario
 */
app.post('/users/setState/:userId/:action', async (req, res) => {
    const userId = req.params.userId
    const action = req.params.action

    if (!userId || !action) {
        return res.status(500).json({
            ok: false,
            error: {
                message: 'The required params are invalid.'
            }
        });
    }

    const stateToUpdate = {}

    if (['suspend', 'delete'].includes(action)) {
        let adminUsersDb = await User.find({ role: 'ADMIN', status: 1 }).exec()

        if (!adminUsersDb || adminUsersDb.length < 2) {
            return res.status(500).json({
                ok: false,
                source: 'api-validation',
                error: {
                    errors: {
                        message: 'No se puede suspender/eliminar al último usuario administrador.'
                    }
                }
            });
        }

        if (action === 'suspend') {
            stateToUpdate.status = 0
        } else {
            stateToUpdate.status = -1
        }
        
    } else if (action === 'enable') {
        stateToUpdate.status = 1
    } else {
        throw new Error('Action required does not exists')
    }

    User.findByIdAndUpdate(userId, { $set: stateToUpdate }, { runValidators: true, context: 'query' }, (error, userDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                source: 'db-validation',
                error
            });
        }

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                identificator: 'db-validation',
                error: {
                    errors: {
                        message: 'No se puede encontrar al usuario para actualizar su estado.'
                    }
                }
            });
        }

        res.json({
            ok: true,
            data: userDb
        })
    })
})

module.exports = app;