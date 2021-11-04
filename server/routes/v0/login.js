const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Machine = require('../../models/machines')

const app = express();

app.post('/login', (req, res, next) => {
    try {
        let body = req.body;
    
        User.findOne({employeeId: body.employeeId, status: 1}, (error, userDb) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
    
            if (!userDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Employee Id does not correct.'
                    }
                });
            }
    
            if (!bcrypt.compareSync(body.password, userDb.password)) {
                return res.status(400).json({
                    ok: false,
                    key: 'user-authentication',
                    error: {
                        message: 'Password does not correct.'
                    }
                })
            }
    
            // Encriptación de datos para el token
            const token = jwt.sign({
                user: userDb,
            }, process.env.SEED, {
                expiresIn: process.env.CADUCIDAD_TOKEN
            })
    
            const dataResult = {
                userId: userDb._id,
                userRole: userDb.role,
                userFullname: userDb.fullname,
                userLastname: userDb.lastname,
                userEmployeeId: userDb.employeeId
            }
    
            if (userDb.role === 'ADMIN') {
                return res.json({
                    ok: true,
                    data: dataResult,
                    token
                })
            }
    
            // Control de Ip del dispositivo
            Machine.findOne({ devices: body.deviceIp, status: { $ne: -1 } }, (errorMachine, machineDb) => {
                if (errorMachine) {
                    return res.status(500).json({
                        ok: false,
                        error
                    })
                }
    
                if (!machineDb) {
                    return res.status(400).json({
                        ok: false,
                        key: 'device-ip',
                        error: {
                            message: 'Device Ip does not correct.'
                        }
                    })
                }
    
                const dataResult = {
                    userId: userDb._id,
                    userRole: userDb.role,
                    userFullname: userDb.fullname,
                    userLastname: userDb.lastname,
                    userEmployeeId: userDb.employeeId,
                    machine: {
                        id: machineDb._id,
                        name: machineDb.name,
                        identifier: machineDb.identifier,
                        status: machineDb.status
                    }
                }
    
                res.json({
                    ok: true,
                    data: dataResult,
                    token
                })
            })
        });
    } catch(error) {
        next(error)
    }
});

module.exports = app;