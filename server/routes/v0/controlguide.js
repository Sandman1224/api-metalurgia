const express = require('express')
const controlGuide = require('../../models/control-guide')

const app = express()

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
            user: controlTemplatesDb
        })
    })
})

module.exports = app