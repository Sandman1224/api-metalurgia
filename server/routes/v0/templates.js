const express = require('express')
const Template = require('../../models/templates')
const ObjectId = require('mongoose').Types.ObjectId
const { ACTIVE_ITEM } = require('../../utils/constans')

const app = express()

app.get('/template/:machineId', (req, res) => {
    const machineId = req.params.machineId
    const status = req.query.status

    if (!machineId) {
        return res.status(500).json({
            ok: false,
            error: {
                message: 'The required params are invalid.'
            }
        });
    }

    const query = { machine_id: new ObjectId(machineId) }

    if (status) {
        query.status = parseInt(status)
    }

    Template.find(query, (error, templateDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!templateDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Required template does not exists.'
                }
            });
        }

        res.json({
            ok: true,
            template: templateDb
        })
    })
})

app.post('/template', (req, res) => {
    let { type, machine_id, created, created_by } = req.body

    let template = new Template({
        type,
        machine_id,
        status: ACTIVE_ITEM,
        created,
        created_by
    })

    template.save((error, templateDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        res.status(201).json({
            ok: true,
            template: templateDb
        })
    })
})

app.post('/setTemplate/:templateId', (req, res) => {
    const templateId = req.params.templateId
    const status = req.query.body

    if (!templateId) {
        return res.status(500).json({
            ok: false,
            error: {
                message: 'The required params are invalid.'
            }
        });
    }

    const bodyUpdate = {
        status
    }

    Template.findByIdAndUpdate(templateId, bodyUpdate, (error, templateDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!templateDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Something went wrong.'
                }
            });
        }

        res.json({
            ok: true,
            template: templateDb
        })
    })
})

module.exports = app;