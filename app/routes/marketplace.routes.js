module.exports = app => {
    const MarketPlace = require("../controllers/marketplace.controllers")
    const access_token = require("../services/token.services")

    //Place Bid
    app.post("/placeBid",access_token.authenticateJWT, MarketPlace.placeBid);

}