const Authtable = require("../models/auth.model.js");
const jwt = require('jsonwebtoken');
const Moralis = require("moralis/node");
const dbConnect = require('../config/db.config')
const express = require('express');
const app = express();
app.use(express.json());
const moment = require('moment');
const schema = require("../schema/schema.model");
const signupSchema = schema.signupSchemas;
const login_logs_schema = schema.login_logs_schemaex;
const authModel = require("../models/auth.model")

const mongodb = require('mongodb');

exports.signup = async (req, res) => {
    if (!Object.keys(req.body).length) {
        return res.status(200).json({
            errorcode: '208',
            message: "Request not Provided",
        });
    }

    else if (!req.body.password || !req.body.email) {
        let params = [req.body.FName, req.body.LName, req.body.Password, req.body.Email];
        let lackingParam = params.findIndex(param => !param === true) > 0 ? params.findIndex(param => !param === true) > 1 ? "" : "Password not provided" : "Email not provided"
        return res.status(200).json({
            errorcode: '209',
            message: lackingParam,
        });
    }
    else {
        let data = new signupSchema(req.body);
        let result = await data.save();
        console.log(result);
        res.send(result);
    }
}


exports.getdata = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    console.log("yyy", user)
    let data = await signupSchema.find();
    res.json(data)
}

const login2 = async (clm) => {
    return new Promise(async (resolve, reject) => {
        let userDetail = Moralis.Object.extend("userDetail");
        const query = new Moralis.Query(userDetail);
        query.equalTo("address", clm.address);
        let data = await query.find();
        // console.log("ghjjk",data[0].attributes)
        if (data) {
            resolve(data[0]);
        } else {
            reject("Error");
        }
    })
}


const UpdateLoginLogs = async (clm) => {
    return new Promise(async (resolve, reject) => {
        let data = new login_logs_schema({
            address: clm.address,
            hostname: clm.hostname,
            IP: clm.ip,
            lastRequestAt: clm.lastRequestAt,
            loginTime: moment().format(),
            sessionID: clm.sessionID
        });
        const result = await data.save();
    })
}



const insertAdd = async (clm) => {
    return new Promise(async (resolve, reject) => {
        let userDetail = Moralis.Object.extend("userDetail");
        let adduser = new userDetail();
        adduser.set("address", clm.address);
        adduser.set("hostname", clm.hostname);
        adduser.set("ip", clm.ip);
        adduser.set("astRequestAt", clm.astRequestAt);
        adduser.set("lastLogin", moment().format());
        adduser.set("sessionID", clm.sessionID);
        adduser.set("username", clm.address)

        adduser.set("name", "");
        adduser.set("username", "");
        adduser.set("bio", "");
        adduser.set("profilepic", "");
        adduser.set("profilebanner", "");
        adduser.set("homeaddress", "");
        adduser.set("city", "");
        adduser.set("email", "");
        adduser.set("phone", "");
        adduser.set("twitter", "");
        adduser.set("facebook", "");
        adduser.set("instagram", "");
        adduser.set("websiteurl", "");

        await adduser.save();
        resolve("done");
    })
}


exports.Authlogin = async function (req, res) {
    const clm = {
        address: req.body.address
    }
    const authuser1 = {
        address: req.body.address,
        hostname: "",
        ip: "",
        sessionID: req.session.id,
        lastRequestAt: req.session._lastRequestAt
    };
    const data1 = await login2(clm);
    if (!data1) {
        const insAdd = await insertAdd(authuser1);
    }
    const data = await login2(clm);
    const access_token = jwt.sign({
        address: data.attributes.address
    },
        process.env.JWT_SECRET, {
        expiresIn: "5d"
    });

    let useralldata = data.attributes;
    data.attributes.password = "NahiBataunga";

    res.send({
        message: 'Authorized User',
        accessToken: access_token,
        user: useralldata
    })
};
