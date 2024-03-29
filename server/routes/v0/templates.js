const express = require('express')
const Template = require('../../models/templates')
const templatesFacade = require('../../facade/templates-facade')
const ObjectId = require('mongoose').Types.ObjectId
const { ACTIVE_ITEM } = require('../../utils/constans')

const securityMiddleware = require('../../middlewares/authentication')

const app = express()

app.get('/template', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        const action = req.query.action ? req.query.action : 'data'
        let page = parseInt(req.query.page) || 0
        let limit = parseInt(req.query.limit) || 1
    
        const queryData = req.body ? req.body : {}
        const bodyQuery = templatesFacade.queryBuilder(queryData)
    
        const query = Template.find(bodyQuery)
        if (action !== 'export') {
            query.sort({ created: -1 })
            query.skip(page * limit)
            query.limit(limit)
        }
    
        query.exec((error, templatesDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (action !== 'export') {
                Template.countDocuments(bodyQuery).exec((counterError, countDb) => {
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
                        pageSize: templatesDb.length,
                        data: templatesDb
                    })
                })
            } else {
                return res.json({
                    ok: true,
                    data: templatesDb
                })
            }
        })
    } catch(error) {
        next(error)
    }
})

app.get('/template/:machineId', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        const machineId = req.params.machineId
        const status = req.query.status
    
        if (!machineId) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'The required params are invalid.'
                }
            });
        }
    
        const query = { machine_id: new ObjectId(machineId) }
    
        if (status) {
            query.status = parseInt(status)
        }
    
        Template.find(query, (error, templateDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (!templateDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Required template does not exists.'
                    }
                });
            }
    
            res.json({
                ok: true,
                template: templateDb
            })
        })
    } catch(error) {
        next(error)
    }
})

app.post('/template', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        let { type, machine_id, created, created_by } = req.body
    
        let template = new Template({
            type,
            machine_id,
            status: ACTIVE_ITEM,
            created,
            created_by
        })
    
        template.save((error, templateDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
    
            res.status(201).json({
                ok: true,
                template: templateDb
            })
        })
    } catch(error) {
        next(error)
    }
})

app.post('/setTemplate/:templateId', securityMiddleware.checkAppToken, (req, res, next) => {
    try {
        const templateId = req.params.templateId
        const { status } = req.body
    
        if (!templateId) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'The required params are invalid.'
                }
            });
        }
    
        const bodyUpdate = {
            status
        }
    
        Template.findByIdAndUpdate(templateId, bodyUpdate, (error, templateDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (!templateDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Something went wrong.'
                    }
                });
            }
    
            res.json({
                ok: true,
                template: templateDb
            })
        })
    } catch(error) {
        next(error)
    }
    
})

module.exports = app;