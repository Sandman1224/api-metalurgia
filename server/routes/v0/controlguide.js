const express = require('express')
const controlGuide = require('../../models/control-guide')
const ObjectId = require('mongoose').Types.ObjectId

const app = express()

// Obtener una guía de plan de control según el tipo de plantilla
app.get('/controlguide/:type', (req, res) => {
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
})

app.get('/controlguide/byTemplate/:templateId', (req, res) => {
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
})

module.exports = app