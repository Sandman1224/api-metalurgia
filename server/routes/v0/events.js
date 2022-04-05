const express = require('express')
const eventModel = require('../../models/record')
const eventsFacade = require('../../facade/events-facade')

const securityMiddleware = require('../../middlewares/authentication')

const app = express()

app.get('/events', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        const action = req.query.action ? req.query.action : 'data'
        let page = parseInt(req.query.page) || 0
        let limit = parseInt(req.query.limit) || 1

        const queryData = req.body ? req.body : {}
        const bodyQuery = eventsFacade.queryBuilder(queryData)

        const query = eventModel.find(bodyQuery)
        if (action !== 'export') {
            query.sort({ created: -1 })
            query.skip(page * limit)
            query.limit(limit)
        }

        query.exec((error, eventsDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            if (action !== 'export') {
                eventModel.countDocuments(bodyQuery).exec((counterError, countDb) => {
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
                        pageSize: eventsDb.length,
                        data: eventsDb
                    })
                })
            } else {
                return res.json({
                    ok: true,
                    data: eventsDb
                })
            }
        })

    } catch(error) {
        next(error)
    }
})

module.exports = app