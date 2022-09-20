const jwt = require('jsonwebtoken');
const dbConnect = require('../config/db.config')
const moment = require('moment');
const schema = require("../schema/schema.model");
const validatorModel = require('../models/validator.model')
const Moralis = require("moralis/node");
const mongodb = require('mongodb');
const signupSchema = schema.signupSchemaex;
const signupValidatorSchemas = schema.signupValidatorSchemas;
const NFTprofileDetails = schema.NFTprofileDetails;
const NFTValidation = schema.NFTValidations

exports.PriceRange = async (req, res) => {
    const query = new Moralis.Query("nftprofiledetails");
    query.greaterThan("estimatedvalue", req.body.to);
    query.lessThan("estimatedvalue", req.body.from);
    let data = await query.find();
    // let data = await query.limit(30);
    // let data1 = await query.skip(30);
    res.json(data)
}


exports.SearchNFTbyname = async (req, res) => {
    const query = new Moralis.Query("nftprofiledetails");
    const pageSize = 30;
    const toSkip = ((req.body.page - 1) * pageSize);
    query.equalTo("assetname", req.query.assetname);
    query.skip(toSkip);
    query.limit(pageSize);
    let data = await query.find();
    res.json(data)

}

exports.NFTdetail = async (req, res) => {
    const query = new Moralis.Query("nftprofiledetails");
    query.equalTo("tokenid", req.query.tokenid);
    let data = await query.find();
    res.json(data)

}

exports.MarketPlaceNFTs = async (req, res) => {
    const query = new Moralis.Query("nftprofiledetails");
    const pageSize = 30;
    const toSkip = ((req.query.page - 1) * pageSize);
    if (req.query.to && req.query.from) {
        query.greaterThan("estimatedvalue", req.query.to);
        query.lessThan("estimatedvalue", req.query.from);
    }
    if (req.query.blockchain || req.query.assettype || req.query.sortby) {
        query.equalTo("blockchain", req.query.blockchain);
        query.equalTo("typeofart", req.query.assettype);
        if (req.query.sortby == "Low to High") {
            query.ascending("estimatedvalue")
        }
        else if (req.query.sortby == "High to Low") {
            query.descending("estimatedvalue")
        }
        else if (req.query.sortby == "Recent") {
            query.descending("tokenid")
        }
    }
    // query.ascending("tokenid");
    query.skip(toSkip);
    query.limit(pageSize);
    let data = await query.find();
    res.json(data)

}