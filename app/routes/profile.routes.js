module.exports = app => {
    const profileControler = require("../controllers/profile.controllers")
    const access_token = require("../services/token.services")

    //Edit Profile
    app.post("/editProfile",access_token.authenticateJWT, profileControler.editProfile);

    //Create NFT
    app.post("/createNFT",access_token.authenticateJWT, profileControler.createNFT)
    
    //update NFT Detail
    app.post("/updateNFTDetail",access_token.authenticateJWT, profileControler.updateNFTDetail)

    //All NFTs of single user for personal Dashboard
    app.get("/myNFTs",access_token.authenticateJWT, profileControler.myNFTs);

    //Validated NFT of a single user for personal Dashboard
    app.get("/myValidatedNFTs",access_token.authenticateJWT, profileControler.myValidatedNFTs);

    //Marking of Favourite NFTs of user
    app.post("/FavouriteNFTsofUser",access_token.authenticateJWT, profileControler.FavouriteNFTsofUser)

    //Get and count Favourite NFTs of User
    app.get("/GACfavouriteNFTsofUser", profileControler.GACfavouriteNFTsofUser);

    //Remove NFT from favourite list of User
    app.delete("/UserRemoveFromFvrt",access_token.authenticateJWT, profileControler.UserRemoveFromFvrt)

    //Search NFT by name
    app.get("/SearchNFTbyname1",access_token.authenticateJWT, profileControler.SearchNFTbyname);

    //List Your NFT for MarketPlace
    app.put("/listNFTforMP",access_token.authenticateJWT, profileControler.listNFTforMP)

    //On Sale NFTs of single user
    app.get("/onSaleNFTs", profileControler.onSaleNFTs);

    //Buy NFT by User
    app.put("/buyNFT",access_token.authenticateJWT, profileControler.buyNFT)

    //request for Swap Asset
    app.post("/reqForSwapAsset",access_token.authenticateJWT, profileControler.reqForSwapAsset)

    //Accept Swap Request
    app.post("/acceptSwapRequest",access_token.authenticateJWT, profileControler.acceptSwapRequest)

    //Cancle Swap Request
    app.post("/cancleSwapRequest",access_token.authenticateJWT, profileControler.cancleSwapRequest)

    //Burn NFT
    app.post("/burnNFT",access_token.authenticateJWT, profileControler.burnNFT)

    //Redeem NFT
    app.post("/redeemNFT",access_token.authenticateJWT, profileControler.redeemNFT)

    //Transfer NFT
    app.post("/transferNFT",access_token.authenticateJWT, profileControler.transferNFT)

    //Activity for user
    app.get("/AllActivities",access_token.authenticateJWT, profileControler.AllActivities);

    //All NFTs of single user for public Dashboard
    app.get("/userNFTs",access_token.authenticateJWT, profileControler.userNFTs);

    //All created NFTs of single user for public Dashboard
    app.get("/userCreatedNFTs",access_token.authenticateJWT, profileControler.userCreatedNFTs);

    //Validated NFT of a single user for public Dashboard
    app.get("/userValidatedNFTs",access_token.authenticateJWT, profileControler.userValidatedNFTs);

    //Send redeem request to validator
    app.post("/sendredeemreq",access_token.authenticateJWT, profileControler.sendredeemreq)
}