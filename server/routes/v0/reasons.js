const express = require('express')
const reasonsModel = require('../../models/reasons')
const reasonsFacade = require('../../facade/reasons-facade')

const app = express()

app.get('/reasons', (req, res) => {
    try {
        const action = req.query.action ? req.query.action : 'data'
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 1

        const queryData = req.body ? req.body : {}
        const bodyQuery = reasonsFacade.queryBuilder(queryData)

        const query = reasonsModel.find(bodyQuery)
        query.sort({ created: -1 })
        query.skip(page * limit)
        query.limit(limit)

        query.exec((error, reasonsDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            reasonsModel.countDocuments(bodyQuery).exec((counterError, countDb) => {
                if (counterError) {
                    return res.status(500).json({
                        ok: false,
                        counterError
                    })
                }

                return res.json({
                    ok: true,
                    total: countDb,
                    page: page,
                    pageSize: reasonsDb.length,
                    data: reasonsDb
                })
            })
        })
    } catch (error) {
        next(error)
    }
})

/**
 * Buscar una causa por id
 */
 app.get('/reasons/:reasonId', (req, res) => {
    const reasonId = req.params.reasonId

    if (!reasonId) {
        return res.status(500).json({
            ok: false,
            error: {
                message: 'The required params are invalid.'
            }
        });
    }

    reasonsModel.findById(reasonId, (error, reasonDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!reasonDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Required data does not exists.'
                }
            });
        }

        res.json({
            ok: true,
            data: reasonDb
        })
    })
})

/**
 * Editar una razon por Id
 */
 app.post('/reasons/:reasonId', (req, res) => {
    const reasonId = req.params.reasonId
    const reasonDataToUpdate = req.body

    if (!reasonId) {
        return res.status(500).json({
            ok: false,
            error: {
                message: 'The required params are invalid.'
            }
        });
    }

    reasonsModel.findByIdAndUpdate(reasonId, { $set: reasonDataToUpdate }, { runValidators: true, context: 'query' }, (error, reasonDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!reasonDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Can not find required machine to update.'
                }
            });
        }

        res.json({
            ok: true,
            data: reasonDb
        })
    })
})

/**
 * Agregar una nueva razón
 */
app.put('/reasons', (req, res) => {
    let body = req.body

    let reasonModel = new reasonsModel(body)
    reasonModel.save((error, reasonDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                source: 'db-validation',
                error
            });
        }

        res.status(201).json({
            ok: true,
            data: reasonDb
        })
    })
})

/**
 * Eliminar una razon por id
 */
app.delete('/reasons/:reasonId', (req, res) => {
    const reasonId = req.params.reasonId

    if (!reasonId) {
        return res.status(500).json({
            ok: false,
            error: {
                message: 'The required params are invalid.'
            }
        });
    }

    const deletedStatus = { status: -1 }

    reasonsModel.findByIdAndUpdate(reasonId, { $set: deletedStatus }, { runValidators: true, context: 'query' }, (error, reasonDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!reasonDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Can not find required machine to update.'
                }
            });
        }

        res.json({
            ok: true,
            data: reasonDb
        })
    })
})

module.exports = app