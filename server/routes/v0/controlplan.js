const express = require('express')
const controlPlan = require('../../models/control-plan')
const ObjectId = require('mongoose').Types.ObjectId
const planControlFacade = require('../../facade/plancontrol-facade')

const securityMiddleware = require('../../middlewares/authentication')

const app = express()

app.get('/controlplans', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        const action = req.query.action ? req.query.action : 'data'
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 1

        const queryData = req.body ? req.body : {}
        const bodyQuery = planControlFacade.queryBuilder(queryData)

        const query = controlPlan.find(bodyQuery)
        if (action !== 'export') {
            query.sort({ created: -1 })
            query.skip(page * limit)
            query.limit(limit)
        }

        query.exec((error, plancontrolDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            if (action !== 'export') { // Listado de datos con paginación
                controlPlan.countDocuments(bodyQuery).exec((counterError, countDb) => {
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
                        pageSize: plancontrolDb.length,
                        data: plancontrolDb
                    })
                })
            } else {
                return res.json({
                    ok: true,
                    data: plancontrolDb
                })
            }
        })
    } catch(error) {
        next(error)
    }
})

// Obtener el plan de control de una pieza en particular
app.get('/controlplan', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
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
    } catch(error) {
        next(error)
    }
})

// Crear un nuevo plan de control para una pieza en particular
app.put('/controlplan', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
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
    } catch(error) {
        next(error)
    }
})

// Finalizar una medición del plan de control para una pieza en particular
app.post('/controlplan/completeStep/:template_id/:piece_number', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        const { template_id, piece_number } = req.params
        const controlPlanData = req.body
    
        controlPlan.findOneAndUpdate({ template_id: template_id, piece_number: piece_number }, { "$push": { measures: controlPlanData } }, { new: true }, (error, planControlDb) => {
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
    } catch(error) {
        next(error)
    }
})

app.post('/controlplan/completePlanControl/:template_id/:piece_number', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        const { piece_number, template_id } = req.params
        const statusPlanControl = parseInt(req.body.status)
    
        controlPlan.findOneAndUpdate({ template_id: template_id, piece_number: piece_number }, { $set: { status: statusPlanControl } }, (error, planControlDb) => {
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
    } catch(error) {
        next(error)
    }
})

module.exports = app