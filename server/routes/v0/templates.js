const express = require('express')
const Template = require('../../models/templates')
const ObjectId = require('mongoose').Types.ObjectId

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

module.exports = app;