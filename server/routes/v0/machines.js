const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')
const app = express()

const machineModel = require('../../models/machines')
const recordModel = require('../../models/record')

const machineFacade = require('../../facade/machines-facade')

module.exports = app

// Obtener lista de máquinas activas
app.get('/machines', (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 0
        let limit = parseInt(req.query.limit) || 1
    
        const queryData = req.body ? req.body : {}
        const bodyQuery = machineFacade.queryBuilder(queryData)
    
        machineModel.find(bodyQuery)
            .sort({ created: -1 })
            .skip(page * limit)
            .limit(limit)
            .exec((error, machinesDb) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    });
                }
    
                machineModel.countDocuments(bodyQuery).exec((counterError, countDb) => {
                    if (counterError) {
                        return res.status(500).json({
                            ok: false,
                            counterError
                        });
                    }
    
                    return res.json({
                        ok: true,
                        total: countDb,
                        page: page,
                        pageSize: machinesDb.length,
                        data: machinesDb
                    })
                })
            })
    } catch(error) {
        next(error)
    }
})

/**
 * Buscar una máquina por id
 */
 app.get('/machines/:machineId', (req, res, next) => {
    try {
        const machineId = req.params.machineId
    
        if (!machineId) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'The required params are invalid.'
                }
            });
        }
    
        machineModel.findById(machineId, (error, machineDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (!machineDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Required data does not exists.'
                    }
                });
            }
    
            res.json({
                ok: true,
                data: machineDb
            })
        })
    } catch(error) {
        next(error)
    }
})

// Activar/parar la máquina
app.post('/machine/:machineId/:action', (req, res, next) => {
    try {
        const { machineId, action } = req.params
        const { stopCauses, dateTime, user } = req.body
    
        const machineIdFormatted = new ObjectId(machineId)
        let statusMachine = 0
        if (action === 'activate') {
            statusMachine = 1
        }
    
        machineModel.findOneAndUpdate({ _id: machineIdFormatted }, { $set: { status: statusMachine } }, (error, machineDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (!machineDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Can not find required plan control.'
                    }
                });
            }
    
            let recordData = {}
            if (action === 'activate') {
                recordData = {
                    event: 'enable-machine',
                    dateTime,
                    user,
                    created: moment().unix()
                }
            } else if (action === 'desactivate') {
                recordData = {
                    event: 'stop-machine',
                    dateTime,
                    stopCauses,
                    user,
                    created: moment().unix()
                }
            } else {
                throw new Error('action requested is invalid')
            }
    
            const recordSchema = new recordModel(recordData)
            recordSchema.save().then(savedRecord => {
                if (savedRecord === recordSchema) {
                    return res.status(200).json({
                        ok: true,
                        data: machineDb
                    })
                } else {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'Can not create record activity.'
                        }
                    });
                }
            })
        })
    } catch(error) {
        next(error)
    }   
})

// Agregar una nueva máquina
app.put('/machines', (req, res, next) => {
    try {
        let body = req.body
    
        let machine = new machineModel(body)
        machine.save((error, machineDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    source: 'db-validation',
                    error
                });
            }
    
            res.status(201).json({
                ok: true,
                data: machineDb
            })
        })
    } catch(error) {
        next(error)
    }
})

/**
 * Editar una maquina por Id
 */
 app.post('/machines/:machineId', (req, res, next) => {
    try {
        const machineId = req.params.machineId
        const machineDataToUpdate = req.body
    
        if (!machineId) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'The required params are invalid.'
                }
            });
        }
    
        machineModel.findByIdAndUpdate(machineId, { $set: machineDataToUpdate }, { runValidators: true, context: 'query' }, (error, machineDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (!machineDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Can not find required machine to update.'
                    }
                });
            }
    
            res.json({
                ok: true,
                data: machineDb
            })
        })
    } catch(error) {
        next(error)
    }
})

app.delete('/machines/:machineId', (req, res, next) => {
    try {
        const machineId = req.params.machineId
    
        if (!machineId) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'The required params are invalid.'
                }
            });
        }
    
        const deletedStatus = { status: -1 }
    
        machineModel.findByIdAndUpdate(machineId, { $set: deletedStatus }, { runValidators: true, context: 'query' }, (error, machineDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (!machineDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Can not find required machine to update.'
                    }
                });
            }
    
            res.json({
                ok: true,
                data: machineDb
            })
        })
    } catch(error) {
        next(error)
    }
})