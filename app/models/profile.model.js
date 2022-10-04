const schema = require("../schema/schema.model");
const signupSchema = schema.signupSchemas;
const Moralis = require("moralis/node");

findName = async (address) => {
    return new Promise(async (resolve, reject) => {
        console.log("Hi3");
        let data = await signupSchema.find({ address: address });
        // console.log("Hi4",data.length);
        if (data) {
            resolve(data);
        } else {
            reject("Error");
        }
    })
}

userDetail = async (username) => {
    return new Promise(async (resolve, reject) => {
        let userDetail = Moralis.Object.extend("userDetail");
        const query = new Moralis.Query(userDetail);
        query.equalTo("username", username);
        let data = await query.find();
        if (data) {
            resolve(data[0]);
        } else {
            reject("Error");
        }
    })
}

userDetailByAddress = async (address) => {
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

NFTdetailForMarket = async (clm) => {
    return new Promise(async (resolve, reject) => {
        let nftprofiledetails = Moralis.Object.extend("nftprofiledetails");
        const query = new Moralis.Query(nftprofiledetails);
        query.equalTo("tokenid", clm.toswaptokenid);
        query.equalTo("assetname", clm.toswapassetname);
        let data = await query.find();
        if (data) {
            resolve(data[0]);
        } else {
            reject("Error");
        }
    })
}

validatorDetails = async (address) => {
    return new Promise(async (resolve, reject) => {
        let nftprofiledetails = Moralis.Object.extend("validatorDetail");
        const query = new Moralis.Query(nftprofiledetails);
        query.equalTo("address", address);
        let data = await query.find();
        if (data) {
            resolve(data[0]);
        } else {
            reject("Error");
        }
    })
}

NFTdetailByTokenid = async (clm) => {
    return new Promise(async (resolve, reject) => {
        let nftprofiledetails = Moralis.Object.extend("nftprofiledetails");
        const query = new Moralis.Query(nftprofiledetails);
        query.equalTo("tokenid", clm.tokenid);
        let data = await query.find();
        if (data) {
            resolve(data[0]);
        } else {
            reject("Error");
        }
    })
}

module.exports = {
    findName,
    userDetail,
    NFTdetails,
    NFTdetailForMarket,
    userDetailByAddress,
    validatorDetails,
    NFTdetailByTokenid
}
