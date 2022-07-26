const schema = require("../schema/schema.model");
const signupSchema = schema.signupSchemas;
const NFTprofileDetails = schema.NFTprofileDetails;
const signupValidatorSchemas = schema.signupValidatorSchemas;
const NFTValidation = schema.NFTValidations
const Moralis = require("moralis/node");

detailsOfUser = async (address) => {
    return new Promise(async (resolve, reject) => {
        let userDetail = Moralis.Object.extend("userDetail");
        const query = new Moralis.Query(userDetail);
        query.equalTo("address", address);
        let data = await query.find();
        if (data) {
            resolve(data[0]);
        } else {
            reject("Error");
        }
    })
}

NFTdetails = async (clm) => {
    return new Promise(async (resolve, reject) => {
        let nftprofiledetails = Moralis.Object.extend("nftprofiledetails");
        const query = new Moralis.Query(nftprofiledetails);
        query.equalTo("tokenid", clm.tokenid);
        query.equalTo("assetname", clm.assetname);
        let data = await query.find();
        if (data) {
            resolve(data[0]);
        } else {
            reject("Error");
        }
    })
}

validatorDetail = async (address) => {
    return new Promise(async (resolve, reject) => {
        let validatorDetail = Moralis.Object.extend("validatorDetail");
        const query = new Moralis.Query(validatorDetail);
        query.equalTo("address", address);
        let data = await query.find();
        if (data) {
            resolve(data[0]);
        } else {
            reject("Error");
        }
    })
}

NFTdetailsForValidation = async (validatorusername) => {
    return new Promise(async(resolve, reject) => {
        let data = await NFTValidation.find({validatorusername : validatorusername});
        if (data) {
            resolve(data);
        } else {
            reject("Error");
        }
    })
}


module.exports = {
    detailsOfUser,
    NFTdetails,
    validatorDetail,
    NFTdetailsForValidation
}