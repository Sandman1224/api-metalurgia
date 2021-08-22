const express = require('express')
const controlPlan = require('../../models/control-plan')
const ObjectId = require('mongoose').Types.ObjectId

const app = express()

// Obtener el plan de control de una pieza en particular
app.get('/controlplan/:pieceNumber/:status', (req, res) => {
    const { pieceNumber, status } = req.params

    controlPlan.findOne({ piece_number: pieceNumber, status }, (error, controlPlanDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!controlPlanDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Can not find required plan control.'
                }
            });
        }

        res.json({
            ok: true,
            data: controlPlanDb
        })
    })
})

app.put('/controlplan', (req, res) => {
    const controlPlanData = req.body
    controlPlanData.template_id = new ObjectId(controlPlanData.template_id)

    let controlPlanSchema = new controlPlan(controlPlanData)
    controlPlanSchema.save((error, controlPlanDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        res.status(201).json({
            ok: true,
            data: controlPlanDb
        })
    })
})

module.exports = app