const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')
const app = express()

const machineModel = require('../../models/machines')
const recordModel = require('../../models/record')

module.exports = app

// Obtener lista de máquinas activas
app.get('/machines', (req, res) => {
    let page = parseInt(req.query.page) || 0
    let limit = parseInt(req.query.limit) || 1

    const query = { status: { $gt: -1 } }

    machineModel.find(query)
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

            machineModel.countDocuments(query).exec((counterError, countDb) => {
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
                    pageSize: machinesDb.length,
                    data: machinesDb
                })
            })
        })
})

// Activar/parar la máquina
app.post('/machine/:machineId/:action', (req, res) => {
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
})