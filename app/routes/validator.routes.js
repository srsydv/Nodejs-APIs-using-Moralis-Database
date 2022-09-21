module.exports = app => {
    const validatorControler = require("../controllers/validator.controllers")
    const access_token = require("../services/token.services")

    //validator login
    app.post("/validatorlogin", validatorControler.validatorlogin);

    //Validator Edit Profile
    app.put("/EditvalidatorProfile",access_token.authenticateJWT, validatorControler.validatorEditProfile);

    //All Validators Profile
    app.get("/validatorsProfile",access_token.authenticateJWT, validatorControler.validatorsProfile);

    //send NFT for validation
    app.post("/NFTforValidation",access_token.authenticateJWT, validatorControler.NFTforValidation)

    //Get All NFTs for MarketPlace
    app.get("/getAllNFTs",access_token.authenticateJWT, validatorControler.getAllNFTs);

    //Get NFT by name and tokenId for Validation
    app.get("/getNFTForValidation",access_token.authenticateJWT, validatorControler.getNFTForValidation);

    //Validate NFT by Validator
    app.put("/validateNFT",access_token.authenticateJWT, validatorControler.validatateNFT);

    //All Requests for Validation for validator
    app.get("/RequestforValidation",access_token.authenticateJWT, validatorControler.RequestforValidation);

    //Validated NFTs by single validator
    app.get("/MyValidatedNFT",access_token.authenticateJWT, validatorControler.MyValidatedNFT);

    //Marking of Favourite NFTs of Validator
    app.post("/FavouriteNFTsofValidator",access_token.authenticateJWT, validatorControler.FavouriteNFTsofValidator)

    //Get and count Favourite NFTs of Validator
    app.get("/GACfavouriteNFTsofValidator",access_token.authenticateJWT, validatorControler.GACfavouriteNFTsofValidator);

    //Remove NFT from favourite list of Validator
    app.delete("/RemoveFromFvrt",access_token.authenticateJWT, validatorControler.RemoveFromFvrt)

    //Activity for Validator
    app.get("/AllActivitiesofValidator",access_token.authenticateJWT, validatorControler.AllActivitiesofValidator);

    //Check validation request for single NFT
    app.get("/validationRequestForSingleNFT",access_token.authenticateJWT, validatorControler.validationRequestForSingleNFT);

}