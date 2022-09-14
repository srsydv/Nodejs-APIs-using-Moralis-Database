
const jwt = require('jsonwebtoken');
const dbConnect = require('../config/db.config')
const moment = require('moment');
const schema = require("../schema/schema.model");
const validatorModel = require('../models/validator.model')
const Moralis = require("moralis/node");
const mongodb = require('mongodb');
const signupValidatorSchemas = schema.signupValidatorSchemas;
const NFTprofileDetails = schema.NFTprofileDetails;
const NFTValidation = schema.NFTValidations
const favouriteNFTs = schema.favouriteNFTs



exports.validatorsProfile = async (req, res) => {
    const query = new Moralis.Query("validatorDetail");
    const pageSize = 30;
    const toSkip = ((req.body.page - 1) * pageSize);
    query.skip(toSkip);
    query.limit(pageSize);
    let data = await query.find();
    res.json(data)
}

exports.validatorEditProfile = async (req, res) => {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await validatorModel.checkValidator(req.body.username);
    if (userDetail) {
        res.send({ result: "username already exist" })
    }
    else {
        let validatorDetail = Moralis.Object.extend("validatorDetail");
        const query = new Moralis.Query(validatorDetail);
        query.equalTo("address", user.address);
        let addvalidatorDetail = await query.first();
        if (addvalidatorDetail) {
            addvalidatorDetail.set("name", req.body.name);
            addvalidatorDetail.set("username", req.body.username);
            addvalidatorDetail.set("bio", req.body.bio);
            addvalidatorDetail.set("profilepic", req.body.profilepic);
            addvalidatorDetail.set("profilebanner", req.body.profilebanner);
            addvalidatorDetail.set("homeaddress", req.body.homeaddress);
            addvalidatorDetail.set("city", req.body.city);
            addvalidatorDetail.set("email", req.body.email);
            addvalidatorDetail.set("phone", req.body.phone);
            addvalidatorDetail.set("twitter", req.body.twitter);
            addvalidatorDetail.set("facebook", req.body.facebook);
            addvalidatorDetail.set("instagram", req.body.instagram);
            addvalidatorDetail.set("websiteurl", req.body.websiteurl);
            await addvalidatorDetail.save();

            res.send({ result: "updated" })
        }
        else {
            res.send({ result: "User Not Found" })
        }
    }
}

login2 = async (clm) => {
    return new Promise(async (resolve, reject) => {
        let validatorDetail = Moralis.Object.extend("validatorDetail");
        const query = new Moralis.Query(validatorDetail);
        query.equalTo("address", clm.address);
        let data = await query.find();
        if (data) {
            resolve(data[0]);
        } else {
            reject("Error");
        }
    })
}

insertAdd = async (clm) => {
    return new Promise(async (resolve, reject) => {
        let validatorDetail = Moralis.Object.extend("validatorDetail");
        let addValidator = new validatorDetail();
        addValidator.set("address", clm.address);
        addValidator.set("hostname", clm.hostname);
        addValidator.set("ip", clm.ip);
        addValidator.set("astRequestAt", clm.astRequestAt);
        addValidator.set("lastLogin", moment().format());
        addValidator.set("sessionID", clm.sessionID);
        addValidator.set("username", clm.address)

        addValidator.set("name", "");
        addValidator.set("username", "");
        addValidator.set("bio", "");
        addValidator.set("profilepic", "");
        addValidator.set("profilebanner", "");
        addValidator.set("homeaddress", "");
        addValidator.set("city", "");
        addValidator.set("email", "");
        addValidator.set("phone", "");
        addValidator.set("twitter", "");
        addValidator.set("facebook", "");
        addValidator.set("instagram", "");
        addValidator.set("websiteurl", "");

        await addValidator.save();
        resolve("done");
    })
}


exports.validatorlogin = async function (req, res) {
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


exports.NFTforValidation = async function (req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const detailsOfUser = await validatorModel.detailsOfUser(user.address)
    const clm = {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
    }
    const NFTdetails = await validatorModel.NFTdetails(clm);
    const validatorDetail = await validatorModel.validatorDetail(req.body.validatorwltaddress);

    let nftForValidation = Moralis.Object.extend("nftForValidation");
    let ForValidation = new nftForValidation();

    ForValidation.set("assetname", req.body.assetname);
    ForValidation.set("tokenid", req.body.tokenid);

    ForValidation.set("ownerusername", NFTdetails.attributes.ownerusername);
    ForValidation.set("ownername", NFTdetails.attributes.ownername);
    ForValidation.set("ownerwltaddress", NFTdetails.attributes.ownerwltaddress);
    ForValidation.set("createrusername", NFTdetails.attributes.createrusername);
    ForValidation.set("creatername", NFTdetails.attributes.creatername);
    ForValidation.set("createrwltaddress", NFTdetails.attributes.createrwltaddress);
    ForValidation.set("address", user.address);
    ForValidation.set("validationstate", "pending");
    ForValidation.set("city", detailsOfUser.attributes.city);
    ForValidation.set("homeaddress", detailsOfUser.attributes.homeaddress);
    ForValidation.set("estimatedvalue", NFTdetails.attributes.estimatedvalue);
    ForValidation.set("validatorwltaddressforvld", req.body.validatorwltaddress);
    ForValidation.set("validatornameforvld", validatorDetail.attributes.name);
    ForValidation.set("validatorusernameforvld", validatorDetail.attributes.username);
    ForValidation.set("nftimage", NFTdetails.attributes.nftimage);
    ForValidation.set("nftimage1", NFTdetails.attributes.nftimage1);
    ForValidation.set("nftimage2", NFTdetails.attributes.nftimage2);
    ForValidation.set("nftimage3", NFTdetails.attributes.nftimage3);
    ForValidation.set("sendforvalidationdate", moment().format());
    await ForValidation.save();

    let nftprofiledetails = Moralis.Object.extend("nftprofiledetails");
    const query = new Moralis.Query(nftprofiledetails);
    query.equalTo("tokenid", req.body.tokenid);
    query.equalTo("assetname", req.body.assetname);
    let oldNFT = await query.first();
    oldNFT.set("validationstate", "pending");
    await oldNFT.save();


    let ValidationActivity = Moralis.Object.extend("activityForValidator");
    let activityForValidation = new ValidationActivity();
    activityForValidation.set("assetname", req.body.assetname);
    activityForValidation.set("tokenid", req.body.tokenid);
    activityForValidation.set("validatorwltaddress", req.body.validatorwltaddress);
    activityForValidation.set("validatorname", validatorDetail.attributes.name);
    activityForValidation.set("validatorusername", validatorDetail.attributes.username);
    activityForValidation.set("ownerusername", NFTdetails.attributes.ownerusername);
    activityForValidation.set("ownername", NFTdetails.attributes.ownername);
    activityForValidation.set("ownerwltaddress", NFTdetails.attributes.ownerwltaddress);
    activityForValidation.set("createrusername", NFTdetails.attributes.createrusername);
    activityForValidation.set("creatername", NFTdetails.attributes.creatername);
    activityForValidation.set("createrwltaddress", NFTdetails.attributes.createrwltaddress);
    activityForValidation.set("userWltAddress", user.address);
    activityForValidation.set("Message", "Validation Request");
    activityForValidation.set("DateAndTime", moment().format());
    await activityForValidation.save();
    res.send({
        message: 'NFT has been sent'
    })
}

exports.getAllNFTs = async (req, res) => {
    let data = await NFTprofileDetails.find({}, { assetname: 1, owner: 1, homeaddress: 1, nftimage: 1, estimatedvalue: 1, onsale: 1, tokenid: 1 });;
    res.json(data)
}

exports.getNFTForValidation = async (req, res) => {
    let data = await NFTValidation.find({ tokenid: req.body.tokenid, assetname: req.body.assetname });
    res.json(data)
}


exports.validatateNFT = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const validatorDetail = await validatorModel.validatorDetail(user.address);

    const clm = {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
    }
    const NFTdetails = await validatorModel.NFTdetails(clm);

    let nftForValidation = Moralis.Object.extend("nftForValidation");
    const query = new Moralis.Query(nftForValidation);
    query.equalTo("tokenid", req.body.tokenid);
    query.equalTo("assetname", req.body.assetname);
    query.equalTo("validatorusernameforvld", validatorDetail.attributes.username);

    let NFTDetail = await query.first();
    let flag = 0;
    if (NFTDetail) {
        NFTDetail.set("validationstate", "Validated");
        NFTDetail.set("validatorname", validatorDetail.attributes.name);
        NFTDetail.set("validatorusername", validatorDetail.attributes.username);
        NFTDetail.set("validatorwltaddress", user.address);
        await NFTDetail.save();
        flag = 1;
    }

    let userActivity = Moralis.Object.extend("activityForUser");
    let ForValidation = new userActivity();
    ForValidation.set("assetname", req.body.assetname);
    ForValidation.set("tokenid", req.body.tokenid);
    ForValidation.set("username", NFTdetails.attributes.ownerusername);
    ForValidation.set("name", NFTdetails.attributes.ownername);
    ForValidation.set("userwltaddress", NFTdetails.attributes.ownerwltaddress);
    ForValidation.set("validatorwltaddress", user.address);
    ForValidation.set("validatorname", validatorDetail.attributes.name);
    ForValidation.set("validatorusername", validatorDetail.attributes.username);
    ForValidation.set("Message", "Charged NFT");
    ForValidation.set("DateAndTime", moment().format());
    await ForValidation.save();

    let ValidationActivity = Moralis.Object.extend("activityForValidator");
    let activityForValidation = new ValidationActivity();
    activityForValidation.set("assetname", req.body.assetname);
    activityForValidation.set("tokenid", req.body.tokenid);
    activityForValidation.set("validatorwltaddress", user.address);
    activityForValidation.set("validatorname", validatorDetail.attributes.name);
    activityForValidation.set("validatorusername", validatorDetail.attributes.username);
    activityForValidation.set("usernameofuser", NFTdetails.attributes.ownerusername);
    activityForValidation.set("nameofuser", NFTdetails.attributes.ownername);
    activityForValidation.set("userwltaddress", NFTdetails.attributes.ownerwltaddress);
    activityForValidation.set("createrusername", NFTdetails.attributes.createrusername);
    activityForValidation.set("creatername", NFTdetails.attributes.creatername);
    activityForValidation.set("createrwltaddress", NFTdetails.attributes.createrwltaddress);
    activityForValidation.set("userWltAddress", user.address);
    activityForValidation.set("Message", "Validation Done");
    activityForValidation.set("DateAndTime", moment().format());
    await activityForValidation.save();

    let nftprofiledetails = Moralis.Object.extend("nftprofiledetails");
    const query1 = new Moralis.Query(nftprofiledetails);
    query1.equalTo("tokenid", req.body.tokenid);
    query1.equalTo("assetname", req.body.assetname);
    let oldNFT = await query1.first();
    if (oldNFT) {
        oldNFT.set("validationstate", "Validated");
        oldNFT.set("validatorname", validatorDetail.attributes.name);
        oldNFT.set("validatorusername", validatorDetail.attributes.username);
        oldNFT.set("validatorwltaddress", user.address);
        if (flag == 1) {
            await oldNFT.save();
            res.send({ result: "Validated" })
        }
    }




}


exports.RequestforValidation = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const validatorDetail = await validatorModel.validatorDetail(user.address);

    const query = new Moralis.Query("nftForValidation");
    const pageSize = 30;
    const toSkip = ((req.body.page - 1) * pageSize);
    query.equalTo("validatorusernameforvld", validatorDetail.attributes.username);
    query.equalTo("validationstate", "pending");
    query.skip(toSkip);
    query.limit(pageSize);
    let data = await query.find();
    res.json(data)

}



exports.MyValidatedNFT = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const validatorDetail = await validatorModel.validatorDetail(user.address);
    const query = new Moralis.Query("nftForValidation");
    const pageSize = 30;
    const toSkip = ((req.body.page - 1) * pageSize);
    query.equalTo("validationstate", "Validated");
    query.equalTo("validatorusername", validatorDetail.attributes.username);
    query.skip(toSkip);
    query.limit(pageSize);
    let data = await query.find();
    res.json(data)
}

exports.FavouriteNFTsofValidator = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const validatorDetail = await validatorModel.validatorDetail(user.address);

    let favouritenft = Moralis.Object.extend("favouritenft");
    let addfavouritenft = new favouritenft();
    addfavouritenft.set("assetname", req.body.assetname);
    addfavouritenft.set("tokenid", req.body.tokenid);
    addfavouritenft.set("validatorname", validatorDetail.attributes.name);
    addfavouritenft.set("validatorusername", validatorDetail.attributes.username);
    addfavouritenft.set("validatorwltaddress", user.address);
    let fvtnft = await addfavouritenft.save();

    res.send(fvtnft);
}


exports.GACfavouriteNFTsofValidator = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const validatorDetail = await validatorModel.validatorDetail(user.address);

    let favouritenft = Moralis.Object.extend("favouritenft");
    const query = new Moralis.Query(favouritenft);
    query.equalTo("validatorusername", validatorDetail.attributes.username);
    let data1 = await query.find();
    let data2 = await query.count();
    res.send(
        {
            favouriteNFTsDetails: data1,
            favouriteNFTsCount: data2
        }
    );
}


exports.RemoveFromFvrt = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const validatorDetail = await validatorModel.validatorDetail(user.address);

    let favouritenft = Moralis.Object.extend("favouritenft");
    const query = new Moralis.Query(favouritenft);
    query.equalTo("validatorusername", validatorDetail.attributes.username);
    query.equalTo("validatorwltaddress", user.address);
    query.equalTo("tokenid", req.body.tokenid);
    query.equalTo("assetname", req.body.assetname);
    const fvtnft = await query.first();
    if (fvtnft) {
        await fvtnft.destroy();
        res.send({ result: "removed" })
    }
}



exports.AllActivitiesofValidator = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const query = new Moralis.Query("activityForValidator");
    const query1 = new Moralis.Query("activityForValidator");
    const query2 = new Moralis.Query("activityForValidator");
    query.equalTo("validatorwltaddress", user.address);
    const pageSize = 10;
    const toSkip = ((req.body.page - 1) * pageSize);
    let flag = 0;
    if (req.body.activity === "Swap Requests") {
        flag = 1;
    }
    if (flag == 1) {
        query.equalTo("Message", "Swap Request IN");
        query1.equalTo("Message", "Swap Request OUT");
        query2.equalTo("Message", "Swap Request Accepted");

    }
    else {
        if (req.body.activity == "Validation Request" || req.body.activity == "Validation Done" || req.body.activity == "Burned" || req.body.activity == "Swap Request IN" || req.body.activity == "Swap Request OUT" || req.body.activity == "Swap Request Accepted") {
            query.equalTo("Message", req.body.activity);
            if (req.body.sortby == "Latest") {
                query.descending("DateAndTime");
            }
            if (req.body.sortby == "Oldest") {
                query.ascending("DateAndTime");
            }
        }

    }
    query.skip(toSkip);
    query.limit(pageSize);
    query1.skip(toSkip);
    query1.limit(pageSize);
    query2.skip(toSkip);
    query2.limit(pageSize);
    let data1 = await query.find();
    let data2 = await query1.find();
    let data3 = await query2.find();
    if (flag == 1) {
        const len = data1.length + data2.length + data3.length;
        res.json({ data1, data2, data3 });
        flag = 0;
    }
    else {
        res.json(data1)
    }

}
