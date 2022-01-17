const machineModel = require('../models/machines')
const ObjectId = require('mongoose').Types.ObjectId

/**
 * Verificar que no existe una máquina activa con la misma ip
 */
const preSaveValidations = (req, res, next) => {
    const { devices, identifier } = req.body
    const machineId = req.params.machineId

    const queryBuilder = { status: 1, $or: [ { devices: devices }, { identifier: identifier } ] }
    if (machineId) {
        queryBuilder._id = { $ne: new ObjectId(machineId) }
    }

    try {
        machineModel.findOne(queryBuilder, (error, machineDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            if (machineDb) {
                const errors = []

                if (machineDb.devices === devices) {
                    errors.push({ message: 'La ip ya se encuentra asignada a otro dispositivo' })
                } else if (machineDb.identifier == identifier) {
                    errors.push({ message: 'El identificador de dispositivo ya se encuentra asignado a otro dispositivo activo' })
                } else {
                    errors.push({ message: 'Algo fue mal' })
                }
                
                return res.status(500).json({
                    ok: false,
                    source: 'db-validation',
                    error: errors
                });
            }
            
            next()
        })
    } catch(error) {
        next(error)
    }
}

module.exports = {
    preSaveValidations
}