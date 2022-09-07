module.exports = app => {
    const profileControler = require("../controllers/profile.controllers")
    const access_token = require("../services/token.services")

    //Edit Profile
    app.post("/editProfile",access_token.authenticateJWT, profileControler.editProfile);

    //Create NFT
    app.post("/createNFT",access_token.authenticateJWT, profileControler.createNFT)
    
    //update NFT Detail
    app.post("/updateNFTDetail",access_token.authenticateJWT, profileControler.updateNFTDetail)

    //Totle Assets(NFTs) of customer
    app.get("/ttlNFTofcustomer",access_token.authenticateJWT, profileControler.ttlNFTsOfcustomer);

    //Marking of Favourite NFTs of user
    app.post("/FavouriteNFTsofUser",access_token.authenticateJWT, profileControler.FavouriteNFTsofUser)

    //Get and count Favourite NFTs of User
    app.get("/GACfavouriteNFTsofUser", profileControler.GACfavouriteNFTsofUser);

    //Remove NFT from favourite list of User
    app.delete("/UserRemoveFromFvrt",access_token.authenticateJWT, profileControler.UserRemoveFromFvrt)

    //Search NFT by name
    app.get("/SearchNFTbyname1",access_token.authenticateJWT, profileControler.SearchNFTbyname);

    //Sell Your NFT for MarketPlace
    app.put("/sellNFTforMP",access_token.authenticateJWT, profileControler.sellNFTforMP)

    //Buy NFT by User
    app.put("/buyNFT",access_token.authenticateJWT, profileControler.buyNFT)

    //request for Swap Asset
    app.post("/reqForSwapAsset",access_token.authenticateJWT, profileControler.reqForSwapAsset)

    //Accept Swap Request
    app.post("/acceptSwapRequest",access_token.authenticateJWT, profileControler.acceptSwapRequest)
}