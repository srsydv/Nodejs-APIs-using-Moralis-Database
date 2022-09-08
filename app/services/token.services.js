const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const config = require('../config/db.config')
const moment = require('moment');
const Authtable = require("../models/auth.model.js");
const schema = require("../schema/schema.model");
const login_logs_schema = schema.login_logs_schemaex;


get_login_logs = async (clm) => {
    return new Promise(async (resolve, reject) => {
        let data = await login_logs_schema.find({ email: clm.email });
        resolve(data)
    })
}

UpdateLoginLogs = async (email) => {
    return new Promise(async (resolve, reject) => {

        let data = await login_logs_schema.updateOne(
            { email: email },
            {
                $set: { loginTime: moment().format() }
            }
        )
        console.log(data)
    })
}

UpdateLoginLogsAgain = async (clm) => {
    return new Promise(async (resolve, reject) => {
        let data = new login_logs_schema({
            email: clm.email,
            hostname: clm.hostname,
            IP: clm.ip,
            lastRequestAt: clm.lastRequestAt,
            loginTime: moment().format(),
            sessionID: clm.sessionID
        });
        const result = await data.save();
        console.log(result);
    })
}


const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
            if (err) res.status(450).send({ message: "Session Expired" })
            else {
                const authuser1 = {
                    email: payload.email,
                    hostname: "",
                    ip: "",
                    sessionID: req.session.id,
                    lastRequestAt: req.session._lastRequestAt
                };

                // const getData = await get_login_logs(authuser1);
                // if (getData.length == 0) {
                //     res.status(480).send({ message: "You are Disabled" })
                // }
                // else {
                next();
                // await Authtable.UpdateLoginLogsAgain(authuser1)
                // }

            }
        });
    } else {
        res.status(401).send({ "result": "Token not provided" })
    }
};

const dataFromToken = (token, result) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                console.log(err.name)
            } else {
                console.log(err.name)
            }
        }
        else {
            result(null, payload)
        }
    });

};


const verifyRefreshToken = (req, res, next) => {
    const token = req.body.token;

    if (authHeader) {

        jwt.verify(token, process.env.REFRESH_SECRET, (err, payload) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return next(createError.Unauthorized())
                } else {

                    return next(createError.Unauthorized(err.message))
                }
            }
            req.payload = payload

            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    authenticateJWT,
    dataFromToken
}