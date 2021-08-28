const express = require('express')
const controlPlan = require('../../models/control-plan')
const ObjectId = require('mongoose').Types.ObjectId

const app = express()

// Obtener el plan de control de una pieza en particular
app.get('/controlplan', (req, res) => {
    const query = req.body

    controlPlan.findOne(query, (error, controlPlanDb) => {
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

// Crear un nuevo plan de control para una pieza en particular
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

// Finalizar una medición del plan de control para una pieza en particular
app.post('/controlplan/completeStep/:piece_number', (req, res) => {
    const pieceNumber = req.params.piece_number
    const controlPlanData = req.body

    controlPlan.findOneAndUpdate({ piece_number: pieceNumber }, { "$push": { measures: controlPlanData } }, (error, planControlDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!planControlDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Can not find required plan control.'
                }
            });
        }

        res.json({
            ok: true,
            data: planControlDb
        })
    })
})

app.post('/controlplan/completePlanControl/:piece_number', (req, res) => {
    const pieceNumber = req.params.piece_number
    const statusPlanControl = parseInt(req.body.status)

    controlPlan.findOneAndUpdate({ piece_number: pieceNumber }, { $set: { status: statusPlanControl } }, (error, planControlDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!planControlDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Can not find required plan control.'
                }
            });
        }

        res.json({
            ok: true,
            data: planControlDb
        })
    })
})

module.exports = app