module.exports = app => {
    const dashboard = require("../controllers/dashboard.controllers")
    const access_token = require("../services/token.services")

    //Price Range
    app.get("/PriceRange",access_token.authenticateJWT, dashboard.PriceRange);

    //Search NFT by name
    app.get("/SearchNFTbyname",access_token.authenticateJWT, dashboard.SearchNFTbyname);

    //NFT Detail
    app.get("/NFTdetail",access_token.authenticateJWT, dashboard.NFTdetail);

    //Pagiantion of NFT for MarketPlace
    app.get("/MarketPlaceNFTs", dashboard.MarketPlaceNFTs);
}