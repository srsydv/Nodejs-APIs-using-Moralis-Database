const Authtable = require("../models/auth.model.js");
const jwt = require('jsonwebtoken');

const dbConnect = require('../config/db.config')
const moment = require('moment');
const schema = require("../schema/schema.model");
const mongodb = require('mongodb');
const Moralis = require("moralis/node");
const profileModel = require('../models/profile.model')

const serverUrl = process.env.serverUrl;
const appId = process.env.appId;
const masterKey = process.env.masterKey;

exports.editProfile = async (req, res) => {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await profileModel.userDetail(req.body.username);
    if (userDetail) {
        res.send({ result: "username already exist" })
    }
    else {
        let editUserDetail = Moralis.Object.extend("userDetail");
        const query = new Moralis.Query(editUserDetail);
        query.equalTo("address", user.address);
        let addUserDetail = await query.first();
        if (addUserDetail) {
            addUserDetail.set("name", req.body.name);
            addUserDetail.set("username", req.body.username);
            addUserDetail.set("bio", req.body.bio);
            addUserDetail.set("profilepic", req.body.profilepic);
            addUserDetail.set("profilebanner", req.body.profilebanner);
            addUserDetail.set("homeaddress", req.body.homeaddress);
            addUserDetail.set("city", req.body.city);
            addUserDetail.set("email", req.body.email);
            addUserDetail.set("phone", req.body.phone);
            addUserDetail.set("twitter", req.body.twitter);
            addUserDetail.set("facebook", req.body.facebook);
            addUserDetail.set("instagram", req.body.instagram);
            addUserDetail.set("websiteurl", req.body.websiteurl);
            await addUserDetail.save();

            res.send({ result: "updated" })
        }
        else {
            res.send({ result: "User Not Found" })
        }
    }
}


exports.createNFT = async (req, res) => {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const createrDetail = await profileModel.userDetailByAddress((user.address))

    let nftprofiledetails = Moralis.Object.extend("nftprofiledetails");
    let newNft = new nftprofiledetails();
    newNft.set("assetname", req.body.assetname);
    newNft.set("typeofart", req.body.typeofart);
    newNft.set("dimension", req.body.dimension);
    newNft.set("bio", req.body.bio);
    newNft.set("createrusername", createrDetail.attributes.username);
    newNft.set("creatername", createrDetail.attributes.name);
    newNft.set("createrwltaddress", createrDetail.attributes.address);
    newNft.set("ownerusername", createrDetail.attributes.username);
    newNft.set("ownername", createrDetail.attributes.name);
    newNft.set("ownerwltaddress", createrDetail.attributes.address);
    newNft.set("city", createrDetail.attributes.city);
    newNft.set("tokenid", req.body.tokenid);
    newNft.set("dateofcreation", req.body.dateofcreation);
    newNft.set("marking", req.body.marking);
    newNft.set("provenance", req.body.provenance);
    newNft.set("estimatedvalue", req.body.estimatedvalue);
    newNft.set("evidenceofownership", req.body.evidenceofownership);
    newNft.set("nftimage", req.body.nftimage);
    newNft.set("nftimage1", req.body.nftimage1);
    newNft.set("nftimage2", req.body.nftimage2);
    newNft.set("nftimage3", req.body.nftimage3);
    newNft.set("blockchain", req.body.blockchain);
    newNft.set("ipfsmetadataurl", req.body.ipfsmetadataurl);
    newNft.set("validationstate", "Not Started");
    newNft.set("nftcreationdate", moment().format());
    newNft.set("burnNFTstatus", "False");
    newNft.set("swapStatus", "Not Started");
    newNft.set("sellstatus", "Not Started");
    newNft.set("redeemNFTrequest", "False");

    let nft = await newNft.save();
    res.json(nft);
}


exports.updateNFTDetail = async (req, res) => {
    let result = await NFTprofileDetails.updateOne(
        { address: req.body.address },
        { $set: req.body }
    )

    res.send({ result: "updated" })
}


exports.myNFTs = async (req, res) => {
    const query = new Moralis.Query("nftprofiledetails");
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const pageSize = 30;
    const toSkip = ((req.body.page - 1) * pageSize);
    query.equalTo("createrwltaddress", req.query.useraddress);
    query.skip(toSkip);
    query.limit(pageSize);
    let data = await query.find();
    res.json(data)
}


exports.myValidatedNFTs = async (req, res) => {
    const query = new Moralis.Query("nftprofiledetails");
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const pageSize = 30;
    const toSkip = ((req.body.page - 1) * pageSize);
    query.equalTo("ownerwltaddress", user.address);
    query.equalTo("validationstate", "Validated");
    query.skip(toSkip);
    query.limit(pageSize);
    let data = await query.find();
    res.json(data)
}

exports.FavouriteNFTsofUser = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await profileModel.userDetailByAddress(user.address);

    let favouritenft = Moralis.Object.extend("favouritenft");
    let addfavouritenft = new favouritenft();
    addfavouritenft.set("assetname", req.body.assetname);
    addfavouritenft.set("tokenid", req.body.tokenid);
    addfavouritenft.set("name", userDetail.attributes.name);
    addfavouritenft.set("username", userDetail.attributes.username);
    addfavouritenft.set("userwltaddress", user.address);
    let fvtnft = await addfavouritenft.save();

    res.send(fvtnft);
}

exports.GACfavouriteNFTsofUser = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await profileModel.userDetailByAddress(user.address);

    let favouritenft = Moralis.Object.extend("favouritenft");
    const query = new Moralis.Query(favouritenft);
    query.equalTo("username", userDetail.attributes.username);
    let data1 = await query.find();
    let data2 = await query.count();
    res.send(
        {
            favouriteNFTsDetails: data1,
            favouriteNFTsCount: data2
        }
    );

}


exports.UserRemoveFromFvrt = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await profileModel.userDetailByAddress(user.address);
    let favouritenft = Moralis.Object.extend("favouritenft");
    const query = new Moralis.Query(favouritenft);
    query.equalTo("username", userDetail.attributes.username);
    query.equalTo("userwltaddress", user.address);
    query.equalTo("tokenid", req.body.tokenid);
    query.equalTo("assetname", req.body.assetname);
    const fvtnft = await query.first();
    if (fvtnft) {
        await fvtnft.destroy();
        res.send({ result: "removed" })
    }
}



exports.SearchNFTbyname = async (req, res) => {
    let data = await NFTprofileDetails.find(
        {
            assetname: req.body.assetname
        });
    if (data.length > 0) {
        res.send(data);
    }
    else {
        res.send({
            message: "No NFT found"
        });
    }

}

exports.listNFTforMP = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await profileModel.userDetailByAddress(user.address);
    const query = new Moralis.Query("nftprofiledetails");
    query.equalTo("assetname", req.body.assetname);
    query.equalTo("tokenid", req.body.tokenid);
    query.equalTo("ownerusername", userDetail.attributes.username);
    let sellOnMP = await query.first();
    if (sellOnMP) {
        sellOnMP.set("onselldate", moment().format());
        sellOnMP.set("sellstatus", "Pending");
        sellOnMP.set("mptype", req.body.mptype);
        sellOnMP.set("mpprice", req.body.mpprice);
        sellOnMP.set("mpduration", req.body.mpduration);
        sellOnMP.set("mpsupply", req.body.mpsupply);
        sellOnMP.set("mpsetasbundle", req.body.mpsetasbundle);
        sellOnMP.set("mpreserveforspecificbuyer", req.body.mpreserveforspecificbuyer);
        sellOnMP.set("mpfees", req.body.mpfees);
        await sellOnMP.save();

        res.send({ result: sellOnMP })
    }
}


exports.onSaleNFTs = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const pageSize = 30;
    const toSkip = ((req.query.page - 1) * pageSize);
    const userDetail = await profileModel.userDetailByAddress(user.address);
    const query = new Moralis.Query("nftprofiledetails");
    query.equalTo("ownerwltaddress", user.address);
    query.skip(toSkip);
    query.limit(pageSize);
    let data = await query.find();
    res.json(data)

}


exports.buyNFT = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await profileModel.userDetailByAddress(user.address);

    const query = new Moralis.Query("nftprofiledetails");
    query.equalTo("assetname", req.body.assetname);
    query.equalTo("tokenid", req.body.tokenid);
    let sellOnMP = await query.first();
    if (sellOnMP) {
        sellOnMP.set("solddate", moment().format());
        sellOnMP.set("sellstatus", "Sold");
        sellOnMP.set("ownerusername", userDetail.attributes.username);
        sellOnMP.set("ownername", userDetail.attributes.name);
        sellOnMP.set("ownerwltaddress", userDetail.attributes.address);
        await sellOnMP.save();

        res.send({ result: sellOnMP })
    }
    // let result = await NFTprofileDetails.updateMany(
    //     {tokenid : req.body.tokenid,
    //         assetname : req.body.assetname},
    //     {
    //         $set:
    //         {
    //             solddate: moment().format(),
    //             sellstatus: 'Sold',
    //             owner: userDetail[0].name,
    //             owneraddress: userDetail[0].address

    //         }
    //     }
    // )
    // res.send(result);
}


exports.reqForSwapAsset = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await profileModel.userDetailByAddress(user.address);

    const clm = {
        tokenid: req.body.toswaptokenid,
        assetname: req.body.toswapassetname
    }
    const NFTdetails = await profileModel.NFTdetails(clm);
    let userActivity = Moralis.Object.extend("activityForUser");
    let reqForSwap = new userActivity();
    reqForSwap.set("assetname", req.body.assetname);
    reqForSwap.set("tokenid", req.body.tokenid);
    reqForSwap.set("toswapassetname", req.body.toswapassetname);
    reqForSwap.set("toswaptokenid", req.body.toswaptokenid);
    //This address will also get notification for swap Request IN
    reqForSwap.set("swaprequestuserwltAddress", NFTdetails.attributes.ownerwltaddress);
    reqForSwap.set("swaprequestname", NFTdetails.attributes.ownername);
    reqForSwap.set("swaprequestusername", NFTdetails.attributes.ownerusername);
    reqForSwap.set("username", userDetail.attributes.username);
    reqForSwap.set("name", userDetail.attributes.name);
    reqForSwap.set("userwltaddress", user.address);
    // Here will be out sign for swap request
    reqForSwap.set("Message", "Swap Request OUT");
    reqForSwap.set("DateAndTime", moment().format());
    await reqForSwap.save();

    let getSwapReq = new userActivity();
    getSwapReq.set("assetname", req.body.toswapassetname);
    getSwapReq.set("tokenid", req.body.toswaptokenid);
    getSwapReq.set("toswapassetname", req.body.assetname);
    getSwapReq.set("toswaptokenid", req.body.tokenid);
    getSwapReq.set("swaprequestuserwltAddress", user.address);
    getSwapReq.set("swaprequestname", userDetail.attributes.name);
    getSwapReq.set("swaprequestusername", userDetail.attributes.username);
    getSwapReq.set("username", NFTdetails.attributes.ownerusername);
    getSwapReq.set("name", NFTdetails.attributes.ownername);
    getSwapReq.set("userwltaddress", NFTdetails.attributes.ownerwltaddress);
    //Here will be in sign for swap request
    getSwapReq.set("Message", "Swap Request IN");
    getSwapReq.set("DateAndTime", moment().format());
    await getSwapReq.save();



    // let ValidationActivity = Moralis.Object.extend("activityForValidator");
    // let activityForValidation = new ValidationActivity();
    // activityForValidation.set("assetname", req.body.assetname);
    // activityForValidation.set("tokenid", req.body.tokenid);
    // activityForValidation.set("ownerusername", NFTdetails.attributes.ownerusername);
    // activityForValidation.set("ownername", NFTdetails.attributes.ownername);
    // activityForValidation.set("ownerwltaddress", NFTdetails.attributes.ownerwltaddress);
    // activityForValidation.set("createrusername", NFTdetails.attributes.createrusername);
    // activityForValidation.set("creatername", NFTdetails.attributes.creatername);
    // activityForValidation.set("createrwltaddress", NFTdetails.attributes.createrwltaddress);
    // activityForValidation.set("userWltAddress", user.address);
    // activityForValidation.set("Message", "Validation Request");
    // activityForValidation.set("DateAndTime", moment().format());
    // await activityForValidation.save();
    // const reqForSwapToOtherUser = await profileModel.activityOfSwapToOtherUser(clm);

    const query = new Moralis.Query("nftprofiledetails");
    query.equalTo("assetname", req.body.assetname);
    query.equalTo("tokenid", req.body.tokenid);
    let swapNFT = await query.first();
    if (swapNFT) {
        swapNFT.set("swapStatus", `Pending, Swapping Request with tokenId ${req.body.toswaptokenid}`);
        await swapNFT.save();
    }
    res.send({ result: "Swap Request Sent, Successfully" })
}



exports.acceptSwapRequest = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await profileModel.userDetailByAddress(user.address);

    const clm = {
        tokenid: req.body.toswaptokenid,
        assetname: req.body.toswapassetname
    }
    const NFTdetails = await profileModel.NFTdetails(clm);
    let userActivity = Moralis.Object.extend("activityForUser");
    let reqForSwap = new userActivity();
    reqForSwap.set("assetname", req.body.assetname);
    reqForSwap.set("tokenid", req.body.tokenid);
    reqForSwap.set("toswapassetname", req.body.toswapassetname);
    reqForSwap.set("toswaptokenid", req.body.toswaptokenid);
    reqForSwap.set("swaprequesttouserwltAddress", NFTdetails.attributes.ownerwltaddress);
    reqForSwap.set("swaprequesttoname", NFTdetails.attributes.ownername);
    reqForSwap.set("swaprequesttousername", NFTdetails.attributes.ownerusername);
    reqForSwap.set("username", userDetail.attributes.username);
    reqForSwap.set("name", userDetail.attributes.name);
    reqForSwap.set("userwltaddress", user.address);
    reqForSwap.set("Message", "Swap Request Accepted");
    reqForSwap.set("DateAndTime", moment().format());
    await reqForSwap.save();

    // let getSwapped = new userActivity();
    // getSwapped.set("assetname", req.body.toswapassetname);
    // getSwapped.set("tokenid", req.body.toswaptokenid);
    // getSwapped.set("toswapassetname", req.body.assetname);
    // getSwapped.set("toswaptokenid", req.body.tokenid);
    // getSwapped.set("swaprequestuserwltAddress", user.address);
    // getSwapped.set("swaprequestname", userDetail.attributes.name);
    // getSwapped.set("swaprequestusername", userDetail.attributes.username);
    // getSwapped.set("username", NFTdetails.attributes.ownerusername);
    // getSwapped.set("name", NFTdetails.attributes.ownername);
    // getSwapped.set("userwltaddress", NFTdetails.attributes.ownerwltaddress);
    // //Here will be in sign for swap request
    // getSwapped.set("Message", "Swap Request IN");
    // getSwapped.set("DateAndTime", moment().format());
    // await getSwapped.save();

    const query = new Moralis.Query("nftprofiledetails");
    query.equalTo("assetname", req.body.assetname);
    query.equalTo("tokenid", req.body.tokenid);
    let swappedNFT = await query.first();
    if (swappedNFT) {
        swappedNFT.set("swapStatus", `Swapped with tokenId ${req.body.toswaptokenid}`);
        swappedNFT.set("ownerusername", NFTdetails.attributes.ownerusername);
        swappedNFT.set("ownername", NFTdetails.attributes.ownername)
        swappedNFT.set("ownerwltaddress", NFTdetails.attributes.ownerwltaddress)
        await swappedNFT.save();
    }

    const newquery = new Moralis.Query("nftprofiledetails");
    query.equalTo("assetname", req.body.toswapassetname);
    query.equalTo("tokenid", req.body.toswaptokenid);
    let changeOwnerNFT = await newquery.first();
    if (changeOwnerNFT) {
        changeOwnerNFT.set("swapStatus", `Swapped with tokenId ${req.body.tokenid}`);
        changeOwnerNFT.set("ownerusername", userDetail.attributes.username);
        changeOwnerNFT.set("ownername", userDetail.attributes.name)
        changeOwnerNFT.set("ownerwltaddress", user.address)
        await changeOwnerNFT.save();
    }

    res.send({ result: "Swapped Successfully" })
}



exports.burnNFT = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await profileModel.userDetailByAddress(user.address);

    const clm = {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
    }
    const NFTdetails = await profileModel.NFTdetails(clm);
    const validatorDetails = await profileModel.validatorDetails(req.body.validatorwltaddress);

    let userActivity = Moralis.Object.extend("activityForUser");
    let brunActivity = new userActivity();
    brunActivity.set("assetname", req.body.assetname);
    brunActivity.set("tokenid", req.body.tokenid);
    //Asset NFT Reciever (Validator)
    brunActivity.set("validatorname", validatorDetails.attributes.name);
    brunActivity.set("validatorusername", validatorDetails.attributes.username);
    brunActivity.set("validatorwltaddress", req.body.validatorwltaddress);
    //Locked Money Reciever (You)
    brunActivity.set("username", userDetail.attributes.username);
    brunActivity.set("name", userDetail.attributes.name);
    brunActivity.set("userwltaddress", user.address);
    brunActivity.set("Message", "NFT burned");
    brunActivity.set("DateAndTime", moment().format());
    await brunActivity.save();

    let ValidationActivity = Moralis.Object.extend("activityForValidator");
    let activityForValidation = new ValidationActivity();
    activityForValidation.set("assetname", req.body.assetname);
    activityForValidation.set("tokenid", req.body.tokenid);
    activityForValidation.set("validatorwltaddress", req.body.validatorwltaddress);
    activityForValidation.set("validatorname", validatorDetails.attributes.name);
    activityForValidation.set("validatorusername", validatorDetails.attributes.username);

    //Because only owner can burn it so in owner clm user data will be storing
    //In UI we "Burned by Address" insted of ownerwltaddress
    activityForValidation.set("ownerusername", userDetail.attributes.username);
    activityForValidation.set("ownername", userDetail.attributes.name);
    activityForValidation.set("ownerwltaddress", user.address);
    activityForValidation.set("createrusername", NFTdetails.attributes.createrusername);
    activityForValidation.set("creatername", NFTdetails.attributes.creatername);
    activityForValidation.set("createrwltaddress", NFTdetails.attributes.createrwltaddress);
    activityForValidation.set("userWltAddress", user.address);
    activityForValidation.set("Message", "Burned");
    activityForValidation.set("DateAndTime", moment().format());
    await activityForValidation.save();

    const query = new Moralis.Query("nftprofiledetails");
    query.equalTo("assetname", req.body.assetname);
    query.equalTo("tokenid", req.body.tokenid);
    let NFTburnStatus = await query.first();
    if (NFTburnStatus) {
        NFTburnStatus.set("burnNFTstatus", "True");
        NFTburnStatus.set("ownerwltaddress", req.body.validatorwltaddress);
        NFTburnStatus.set("ownerusername", validatorDetails.attributes.username);
        NFTburnStatus.set("ownername", validatorDetails.attributes.name);
        await NFTburnStatus.save();
    }
    res.send({ result: "NFT Burned, Successfully" })
}




exports.transferNFT = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)

    const clm = {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
    }
    const userDetail = await profileModel.userDetailByAddress(user.address);
    const userDetailOfTransferedAdd = await profileModel.userDetailByAddress(req.body.nfttransferaddress);
    const NFTdetails = await profileModel.NFTdetails(clm);
    let userActivity = Moralis.Object.extend("activityForUser");
    let transferNFTbyUser = new userActivity();
    transferNFTbyUser.set("assetname", req.body.assetname);
    transferNFTbyUser.set("tokenid", req.body.tokenid);
    transferNFTbyUser.set("nfttransferaddress", req.body.nfttransferaddress);
    transferNFTbyUser.set("nfttransferusername", userDetailOfTransferedAdd.attributes.username);
    transferNFTbyUser.set("nfttransfername", userDetailOfTransferedAdd.attributes.name);
    transferNFTbyUser.set("username", userDetail.attributes.username);
    transferNFTbyUser.set("name", userDetail.attributes.name);
    transferNFTbyUser.set("userwltaddress", user.address);
    transferNFTbyUser.set("Message", "NFT Transfered");
    transferNFTbyUser.set("DateAndTime", moment().format());
    await transferNFTbyUser.save();

    let getTransferedNFT = new userActivity();
    getTransferedNFT.set("assetname", req.body.assetname);
    getTransferedNFT.set("tokenid", req.body.tokenid);
    getTransferedNFT.set("nfttransferaddress", user.address);
    getTransferedNFT.set("nfttransferusername", userDetail.attributes.username);
    getTransferedNFT.set("nfttransfername", userDetail.attributes.name);
    getTransferedNFT.set("username", userDetailOfTransferedAdd.attributes.username);
    getTransferedNFT.set("name", userDetailOfTransferedAdd.attributes.name);
    getTransferedNFT.set("userwltaddress", req.body.nfttransferaddress);
    getTransferedNFT.set("Message", "NFT Received");
    getTransferedNFT.set("DateAndTime", moment().format());
    await getTransferedNFT.save();

    const query = new Moralis.Query("nftprofiledetails");
    query.equalTo("assetname", req.body.assetname);
    query.equalTo("tokenid", req.body.tokenid);
    let changeOwnerNFT = await query.first();
    if (changeOwnerNFT) {
        changeOwnerNFT.set("ownerusername", userDetailOfTransferedAdd.attributes.username);
        changeOwnerNFT.set("ownername", userDetailOfTransferedAdd.attributes.name)
        changeOwnerNFT.set("ownerwltaddress", req.body.nfttransferaddress)
        await changeOwnerNFT.save();
    }

    res.send({ result: "NFT Transfered, Successfully" })
}


exports.AllActivities = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const query3 = new Moralis.Query("activityForUser");
    const query1 = new Moralis.Query("activityForUser");
    const query2 = new Moralis.Query("activityForUser");
    query3.equalTo("userwltaddress", user.address);
    const pageSize = 10;
    const toSkip = ((req.query.page - 1) * pageSize);
    let flag = 0;
    if (req.query.activity === "Swap Requests") {
        flag = 1;
    }
    if (flag == 1) {
        query3.equalTo("Message", "Swap Request IN");
        query1.equalTo("Message", "Swap Request OUT");
        query2.equalTo("Message", "Swap Request Accepted");

    }
    else {
        if (req.query.activity == "NFT Transfered" || req.query.activity == "NFT Received" || req.query.activity == "NFT burned" || req.query.activity == "Swap Request IN" || req.query.activity == "Swap Request OUT" || req.query.activity == "Swap Request Accepted") {
            query3.equalTo("Message", req.query.activity);
            if (req.query.sortby == "Latest") {
                query3.descending("DateAndTime");
            }
            if (req.query.sortby == "Oldest") {
                query3.ascending("DateAndTime");
            }
        }

    }
    query3.skip(toSkip);
    query3.limit(pageSize);
    query1.skip(toSkip);
    query1.limit(pageSize);
    query2.skip(toSkip);
    query2.limit(pageSize);
    let data1 = await query3.find();
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


exports.userNFTs = async (req, res) => {
    const query1 = new Moralis.Query("nftprofiledetails");
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const pageSize = 30;
    const toSkip = ((req.query.page - 1) * pageSize);
    query1.equalTo("ownerwltaddress", req.query.useraddress);
    query1.skip(toSkip);
    query1.limit(pageSize);
    let data = await query1.find();
    res.json(data)
}


exports.userCreatedNFTs = async (req, res) => {
    const query = new Moralis.Query("nftprofiledetails");
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const pageSize = 30;
    const toSkip = ((req.query.page - 1) * pageSize);
    query.equalTo("createrwltaddress", req.query.useraddress);
    query.notEqualTo("validationstate", "Validated");
    query.skip(toSkip);
    query.limit(pageSize);
    let data = await query.find();
    res.json(data)
}


exports.userValidatedNFTs = async (req, res) => {
    const query = new Moralis.Query("nftprofiledetails");
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const pageSize = 30;
    const toSkip = ((req.body.page - 1) * pageSize);
    query.equalTo("ownerwltaddress", req.query.useraddress);
    query.equalTo("validationstate", "Validated");
    query.skip(toSkip);
    query.limit(pageSize);
    let data = await query.find();
    res.json(data)
}

exports.sendredeemreq = async (req, res) => {
    const query = new Moralis.Query("nftprofiledetails");
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const validatorDetails = await profileModel.validatorDetails(req.body.validatorwltaddress);
    const userDetail = await profileModel.userDetailByAddress(user.address);

    const clm = {
        tokenid: req.body.tokenid
    }
    const NFTdetails = await profileModel.NFTdetailByTokenid(clm);
    let ValidationActivity = Moralis.Object.extend("activityForValidator");
    let activityForValidation = new ValidationActivity();
    activityForValidation.set("assetname", req.body.assetname);
    activityForValidation.set("tokenid", req.body.tokenid);
    activityForValidation.set("validatorwltaddress", req.body.validatorwltaddress);
    activityForValidation.set("validatorname", validatorDetails.attributes.name);
    activityForValidation.set("validatorusername", validatorDetails.attributes.username);

    //Because only owner can send request so in owner clm user data will be storing
    //In UI we can show "Redeem request by" insted of "ownerwltaddress"
    activityForValidation.set("ownerusername", userDetail.attributes.username);
    activityForValidation.set("ownername", userDetail.attributes.name);
    activityForValidation.set("ownerwltaddress", user.address);
    activityForValidation.set("createrusername", NFTdetails.attributes.createrusername);
    activityForValidation.set("creatername", NFTdetails.attributes.creatername);
    activityForValidation.set("createrwltaddress", NFTdetails.attributes.createrwltaddress);
    activityForValidation.set("userWltAddress", user.address);
    activityForValidation.set("Message", "Asset Request");
    activityForValidation.set("DateAndTime", moment().format());
    await activityForValidation.save();


    query.equalTo("tokenid", req.body.tokenid);
    query.equalTo("ownerwltaddress", user.address);
    let yourNFT = await query.first();
    
    if(yourNFT){
        yourNFT.set("redeemNFTrequest", "True");
        yourNFT.save();
    }
    res.json({
        message:"Request send"
    })
}

exports.redeemNFT = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await profileModel.userDetailByAddress(user.address);

    const clm = {
        tokenid: req.body.tokenid,
        assetname: req.body.assetname
    }
    const NFTdetails = await profileModel.NFTdetails(clm);
    const validatorDetails = await profileModel.validatorDetails(req.body.validatorwltaddress);

    let userActivity = Moralis.Object.extend("activityForUser");
    let brunActivity = new userActivity();
    brunActivity.set("assetname", req.body.assetname);
    brunActivity.set("tokenid", req.body.tokenid);
    //Locked Money Reciever (Validator)
    brunActivity.set("validatorname", validatorDetails.attributes.name);
    brunActivity.set("validatorusername", validatorDetails.attributes.username);
    brunActivity.set("validatorwltaddress", req.body.validatorwltaddress);
    //Asset NFT Reciever (You)
    brunActivity.set("username", userDetail.attributes.username);
    brunActivity.set("name", userDetail.attributes.name);
    brunActivity.set("userwltaddress", user.address);
    brunActivity.set("Message", "Redeem NFT");
    brunActivity.set("DateAndTime", moment().format());
    await brunActivity.save();

    let ValidationActivity = Moralis.Object.extend("activityForValidator");
    let activityForValidation = new ValidationActivity();
    activityForValidation.set("assetname", req.body.assetname);
    activityForValidation.set("tokenid", req.body.tokenid);
    activityForValidation.set("validatorwltaddress", req.body.validatorwltaddress);
    activityForValidation.set("validatorname", validatorDetails.attributes.name);
    activityForValidation.set("validatorusername", validatorDetails.attributes.username);

    //Because only owner can burn it so in owner clm user data will be storing
    //In UI we can show "Redeem by" insted of "ownerwltaddress"
    activityForValidation.set("ownerusername", userDetail.attributes.username);
    activityForValidation.set("ownername", userDetail.attributes.name);
    activityForValidation.set("ownerwltaddress", user.address);
    activityForValidation.set("createrusername", NFTdetails.attributes.createrusername);
    activityForValidation.set("creatername", NFTdetails.attributes.creatername);
    activityForValidation.set("createrwltaddress", NFTdetails.attributes.createrwltaddress);
    activityForValidation.set("userWltAddress", user.address);
    activityForValidation.set("Message", "Redeem NFT");
    activityForValidation.set("DateAndTime", moment().format());
    await activityForValidation.save();

    const query = new Moralis.Query("nftprofiledetails");
    query.equalTo("assetname", req.body.assetname);
    query.equalTo("tokenid", req.body.tokenid);
    let NFTburnStatus = await query.first();
    if (NFTburnStatus) {
        NFTburnStatus.set("redeemNFTstatus", "True");
        NFTburnStatus.set("validationstate", "Not Started");
        NFTburnStatus.set("validatorname", "");
        NFTburnStatus.set("validatorusername", "");
        NFTburnStatus.set("validatorwltaddress", "");
        NFTburnStatus.set("validateAmount", "");
        await NFTburnStatus.save();
    }
    res.send({ result: "NFT Redeem, Successfully" })
}

