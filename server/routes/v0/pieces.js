const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId
const Piece = require('../../models/pieces')
const piecesFacade = require('../../facade/pieces-facade')
const moment = require('moment')

const app = express()

// Obtener las piezas realizadas por una maquina
app.get('/pieces/:machineId/:templateId', (req, res) => {
    const machineId = req.params.machineId
    const templateId = req.params.templateId
    const machineCode = req.body.machineCode

    if (!machineId) {
        return res.status(500).json({
            ok: false,
            error: {
                message: 'The required params are invalid.'
            }
        });
    }

    const query = { 
        machine_id: new ObjectId(machineId),
        template_id: new ObjectId(templateId) 
    }

    Piece.find(query, (error, piecesDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!piecesDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Required data does not exists.'
                }
            });
        }

        const monthOfDate = moment().format('M')
        const nextCodePiece = piecesFacade.getPieceCode(machineCode, monthOfDate, piecesDb.length)

        res.json({
            ok: true,
            data: {
                pieces: piecesDb,
                nextCodePiece
            }
        })
    })
})

// Agrega una nueva pieza a la plantilla
app.post('/pieces', (req, res) => {
    let body = req.body

    let piece = new Piece(body)

    piece.save((error, pieceDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        res.status(201).json({
            ok: true,
            data: {
                piece: pieceDb
            }
        });
    })
})

module.exports = app