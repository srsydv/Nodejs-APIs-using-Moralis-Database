const schema = require("../schema/schema.model");
const signupSchema = schema.signupSchemas;
const Moralis = require("moralis/node");



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


NFTdetail = async (tokenid) => {
    return new Promise(async (resolve, reject) => {
        let nftprofiledetails = Moralis.Object.extend("nftprofiledetails");
        const query = new Moralis.Query(nftprofiledetails);
        query.equalTo("tokenid", tokenid);
        let data = await query.find();
        if (data) {
            resolve(data[0]);
        } else {
            reject("Error");
        }
    })
}

module.exports = {
    userDetailByAddress,
    NFTdetail
}
