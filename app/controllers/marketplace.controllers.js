const jwt = require('jsonwebtoken');
const dbConnect = require('../config/db.config')
const moment = require('moment');
const schema = require("../schema/schema.model");
const marketplaceModel = require('../models/marketplace.model')
const Moralis = require("moralis/node");
const mongodb = require('mongodb');


exports.placeBid = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await marketplaceModel.userDetailByAddress((user.address))
    const NFTdetail = await marketplaceModel.NFTdetail(req.body.tokenid)

    let makeNewBid = Moralis.Object.extend("Marketplace");
    let newBid = new makeNewBid();
    newBid.set("assetname", NFTdetail.attributes.assetname);
    newBid.set("typeofart", NFTdetail.attributes.typeofart);
    newBid.set("ownerusername", NFTdetail.attributes.ownerusername);
    newBid.set("ownername", NFTdetail.attributes.ownername);
    newBid.set("ownerwltaddress", NFTdetail.attributes.ownerwltaddress);
    newBid.set("tokenid", req.body.tokenid);
    newBid.set("dateofcreation", NFTdetail.attributes.dateofcreation);
    newBid.set("marking", NFTdetail.attributes.marking);
    newBid.set("provenance", NFTdetail.attributes.provenance);
    newBid.set("estimatedvalue", NFTdetail.attributes.estimatedvalue);
    newBid.set("evidenceofownership", NFTdetail.attributes.evidenceofownership);
    newBid.set("nftimage", NFTdetail.attributes.nftimage);
    newBid.set("nftimage1", NFTdetail.attributes.nftimage1);
    newBid.set("nftimage2", NFTdetail.attributes.nftimage2);
    newBid.set("nftimage3", NFTdetail.attributes.nftimage3);
    newBid.set("blockchain", NFTdetail.attributes.blockchain);
    newBid.set("biddingtime", moment().format());
    newBid.set("biddername", userDetail.attributes.name);
    newBid.set("bidderwltaddress", user.address);
    newBid.set("bidderusername", userDetail.attributes.username);
    newBid.set("biddingamount", req.body.biddingAmount);
    newBid.set("finalbiddername", "");
    newBid.set("finalbidderwltaddress", "");
    newBid.set("finalbidderusername", "");
    newBid.set("finalbiddingamount", "");
    let bid = await newBid.save();

    res.send(bid);

}



exports.acceptBid = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var user = jwt.decode(token, process.env.JWT_SECRET)
    const userDetail = await marketplaceModel.userDetailByAddress((user.address))
    const NFTdetail = await marketplaceModel.NFTdetail(req.body.tokenid)

    let makeNewBid = Moralis.Object.extend("Marketplace");
    let newBid = new makeNewBid();
    newBid.set("assetname", NFTdetail.attributes.assetname);
    newBid.set("typeofart", NFTdetail.attributes.typeofart);
    newBid.set("ownerusername", NFTdetail.attributes.ownerusername);
    newBid.set("ownername", NFTdetail.attributes.ownername);
    newBid.set("ownerwltaddress", NFTdetail.attributes.ownerwltaddress);
    newBid.set("tokenid", req.body.tokenid);
    newBid.set("dateofcreation", NFTdetail.attributes.dateofcreation);
    newBid.set("marking", NFTdetail.attributes.marking);
    newBid.set("provenance", NFTdetail.attributes.provenance);
    newBid.set("estimatedvalue", NFTdetail.attributes.estimatedvalue);
    newBid.set("evidenceofownership", NFTdetail.attributes.evidenceofownership);
    newBid.set("nftimage", NFTdetail.attributes.nftimage);
    newBid.set("nftimage1", NFTdetail.attributes.nftimage1);
    newBid.set("nftimage2", NFTdetail.attributes.nftimage2);
    newBid.set("nftimage3", NFTdetail.attributes.nftimage3);
    newBid.set("blockchain", NFTdetail.attributes.blockchain);
    newBid.set("biddingtime", moment().format());
    newBid.set("biddername", userDetail.attributes.name);
    newBid.set("bidderwltaddress", user.address);
    newBid.set("bidderusername", userDetail.attributes.username);
    newBid.set("biddingamount", req.body.biddingAmount);
    newBid.set("finalbiddername", userDetail.attributes.name);
    newBid.set("finalbidderwltaddress", user.address);
    newBid.set("finalbidderusername", userDetail.attributes.username);
    newBid.set("finalbiddingamount", req.body.biddingAmount);
    let bid = await newBid.save();

    res.send(bid);

}
