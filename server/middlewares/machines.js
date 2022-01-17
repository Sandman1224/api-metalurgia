const machineModel = require('../models/machines')

/**
 * Verificar que no existe una máquina activa con la misma ip
 */
const ipValidation = (req, res, next) => {
    const { devices, identifier } = req.body

    try {
        machineModel.findOne({ status: 1, $or: [ { devices: devices }, { identifier: identifier } ] }, (error, machineDb) => {
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
    ipValidation
}