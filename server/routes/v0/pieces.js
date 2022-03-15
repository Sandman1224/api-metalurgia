const express = require('express')
const asyncHandler = require('express-async-handler')

const ObjectId = require('mongoose').Types.ObjectId
const Piece = require('../../models/pieces')
const piecesFacade = require('../../facade/pieces-facade')
const moment = require('moment')

const securityMiddleware = require('../../middlewares/authentication')

const app = express()

// Obtener las piezas realizadas por una maquina
app.get('/pieces/:machineId', securityMiddleware.checkAppToken, asyncHandler(async (req, res, next) => {
    try {
        const machineId = req.params.machineId
        const machineCode = req.body.machineCode
        
        const currentYear = moment().format('Y')
        const currentMonth = moment().format('M')
        
        const monthCode = piecesFacade.getMonthCode(currentMonth)

        if (!machineId || !machineCode) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'The required params are invalid.'
                }
            });
        }

        let machineCounterPieces = await piecesFacade.getLastPieceCode(machineId, currentYear, currentMonth)
        machineCounterPieces++ // Agregamos la nueva pieza sumando en 1 el contador
        const formattedNumberPieceCode = piecesFacade.zeroFill(machineCounterPieces, 4)
        const newPieceCode = `${machineCode}${monthCode}-${formattedNumberPieceCode}`

        res.json({
            ok: true,
            data: {
                newPieceCode
            }
        })
    } catch(error) {
        next(error)
    }
}))

app.get('/piecesByPagination', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        const action = req.query.action ? req.query.action : 'data'
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 1
        
        const queryData = req.body ? req.body : {}
        const bodyQuery = piecesFacade.queryBuilder(queryData)
        
        const query = Piece.find(bodyQuery)
        if (action !== 'export') {
    
            query.sort({ created: -1 })
            query.skip(page * limit)
            query.limit(limit)
        }
    
        query.exec((error, piecesDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (action !== 'export') { // Listado de datos con paginación
                Piece.countDocuments(bodyQuery).exec((counterError, countDb) => {
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
                        pageSize: piecesDb.length,
                        data: piecesDb
                    })
                })
            } else {
                return res.json({
                    ok: true,
                    data: piecesDb
                })
            }
        })
    } catch(error) {
        next(error)
    }
})

app.get('/pieces', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
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
    } catch(error) {
        next(error)
    }
})

// Agrega una nueva pieza a la plantilla
app.put('/pieces', securityMiddleware.checkAppToken, asyncHandler(async (req, res, next) => {
    try {
        const body = req.body
        
        body.currentYear = moment().format('Y')
        body.currentMonth = moment().format('M')

        const monthCode = piecesFacade.getMonthCode(body.currentMonth)
    
        let piece = new Piece(body)
    
        piece.save(async (error, pieceDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            let machineCounterPieces = await piecesFacade.getLastPieceCode(body.machine_id, body.currentYear, body.currentMonth)
            machineCounterPieces++
            const formattedNumberPieceCode = piecesFacade.zeroFill(machineCounterPieces, 4)
            const newPieceCode = `${body.machine_number}${monthCode}-${formattedNumberPieceCode}`
            
            const countQueryBuilder = { template_id: body.template_id, status: { $gt: -1 } }
            Piece.countDocuments(countQueryBuilder).exec((counterError, countDb) => {
                if (counterError) {
                    return res.status(500).json({
                        ok: false,
                        counterError
                    });
                }

                res.status(201).json({
                    ok: true,
                    totalByTemplate: countDb,
                    data: {
                        piece: pieceDb,
                        newPieceCode
                    }
                })
            })
        })
    } catch(error) {
        next(error)
    }
}))

// Actualizar una pieza
app.post('/pieces/:piece_number/:template_id', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        const pieceNumber = req.params.piece_number
        let templateId = req.params.template_id
        const dataToUpdate = req.body
        const currentYear = parseInt(moment().format('Y'))

        if (templateId) {
            templateId = new ObjectId(templateId)
        }

        dataToUpdate.updated = moment().unix()
    
        Piece.findOneAndUpdate({ template_id: templateId, piece_number: pieceNumber, currentYear: currentYear, status: { $gt: -1 } }, dataToUpdate, { new: true }, (error, pieceDb) => {
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
    } catch(error) {
        next(error)
    }
})

module.exports = app