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
    const createrDetail = await profileModel.userDetailByAddress(user.address)

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
    newNft.set("validationstate", "Not Started");
    newNft.set("nftcreationdate", moment().format());
    newNft.set("burnNFTstatus", "False");
    newNft.set("swapStatus", "Not Started");

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


exports.ttlNFTsOfcustomer = async (req, res) => {
    let data = await NFTprofileDetails.find({ owner: req.body.owner });
    res.send(data);
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

exports.sellNFTforMP = async (req, res) => {
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
        await sellOnMP.save();

        res.send({ result: sellOnMP })
    }
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
        toswaptokenid: req.body.toswaptokenid,
        toswapassetname: req.body.toswapassetname
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
    reqForSwap.set("Message", "Swap Request");
    reqForSwap.set("DateAndTime", moment().format());
    await reqForSwap.save();

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
        toswaptokenid: req.body.toswaptokenid,
        toswapassetname: req.body.toswapassetname
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
