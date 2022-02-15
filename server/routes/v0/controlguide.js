const express = require('express')
const controlGuide = require('../../models/control-guide')
const ObjectId = require('mongoose').Types.ObjectId

const securityMiddleware = require('../../middlewares/authentication')

const app = express()

// Obtener una guía de plan de control según el tipo de plantilla
app.get('/controlguide/:type', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        let typeTemplate = req.params.type
    
        controlGuide.findOne({ type_template: typeTemplate }, (error, controlTemplatesDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (!controlTemplatesDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Can not found control templates.'
                    }
                });
            }
    
            res.json({
                ok: true,
                data: controlTemplatesDb
            })
        })
    } catch(error) {
        next(error)
    }
})

app.get('/controlguide/byTemplate/:templateId', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        const templateIdParam = req.params.templateId
        const templetaIdFormatted = new ObjectId(templateIdParam)
    
        controlGuide.findOne({ template_id: templetaIdFormatted }, (error, controlTemplatesDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (!controlTemplatesDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Can not found guide control templates.'
                    }
                });
            }
    
            res.json({
                ok: true,
                data: controlTemplatesDb
            })
        })
    } catch(error) {
        next(error)
    }
})

module.exports = app