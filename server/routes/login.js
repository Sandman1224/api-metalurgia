const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Machine = require('../models/machines')

const app = express();

app.post('/login', (req, res) => {
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
                of: false,
                error: {
                    message: 'Password does not correct.'
                }
            })
        }

        // Control de Ip del dispositivo
        Machine.findOne({ devices: body.deviceIp, status: 1 }, (errorMachine, machineDb) => {
            if (errorMachine) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }

            if (!machineDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Device Ip does not correct.'
                    }
                })
            }

            let token = jwt.sign({
                user: userDb,
            }, process.env.SEED, {
                expiresIn: process.env.CADUCIDAD_TOKEN
            })

            const dataResult = {
                userId: userDb._id,
                userRole: userDb.role,
                userFullname: userDb.fullname,
                userLastname: userDb.userLastname,
                userEmployeeId: userDb.employeeId,
                machine: {
                    id: machineDb._id,
                    name: machineDb.name,
                    identifier: machineDb.identifier
                }
            }

            res.json({
                ok: true,
                userData: dataResult,
                token
            })
        })
    });
});

module.exports = app;