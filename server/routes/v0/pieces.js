const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId
const Piece = require('../../models/pieces')
const piecesFacade = require('../../facade/pieces-facade')
const moment = require('moment')

const app = express()

// Obtener las piezas realizadas por una maquina
app.get('/pieces/:machineId', (req, res) => {
    const machineId = req.params.machineId
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
        machine_id: new ObjectId(machineId)
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

app.get('/pieces', (req, res) => {
    let queryBuilder = req.body.query
    
    let limit = 0
    const sort = {}
    if (req.body.params) {
        const queryParams = req.body.params
        if (queryParams.limit) {
            limit = parseInt(queryParams.limit)
        }

        if (queryParams.sort) {
            sort[queryParams.sort.field] = queryParams.sort.order
        }
    }

    if (queryBuilder.machine_id) {
        queryBuilder.machine_id = new ObjectId(queryBuilder.machine_id)
    }

    const query = Piece.find(queryBuilder)
    
    if (limit >= 0) {
        query.limit(limit)
    }

    query.sort(sort)

    query.exec((error, piecesDb) => {
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
        
        res.json({
            ok: true,
            data: piecesDb
        })
    })
})

// Agrega una nueva pieza a la plantilla
app.put('/pieces', (req, res) => {
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

// Actualizar una pieza
app.post('/pieces/:piece_number', (req, res) => {
    const pieceNumber = req.params.piece_number
    const dataToUpdate = req.body
    dataToUpdate.updated = moment().unix()

    Piece.findOneAndUpdate({ piece_number: pieceNumber }, dataToUpdate, { new: true }, (error, pieceDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!pieceDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Can not find the required piece.'
                }
            });
        }

        res.json({
            ok: true,
            piece: pieceDb
        })
    })
})

module.exports = app