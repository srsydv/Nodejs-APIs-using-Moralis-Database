const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const easySession = require('easy-session');
const Moralis = require("moralis/node");
var cors = require('cors')
require("dotenv").config();


const app = express();
global.__basedir = __dirname;

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: "*" }))

app.use(cookieParser());
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
              maxAge: 3600000 
            }
}));
app.use(easySession.main(session));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));



// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Shrish's application." });
});


require("./app/routes/auth.routes.js")(app);
require("./app/routes/profile.routes.js")(app);
require("./app/routes/validator.routes.js")(app);
require("./app/routes/dashboard.routes.js")(app);


// serverUrl: `https://hcp8bffs36lu.usemoralis.com:2053/server`,
//     appId: `z6XNskF62yxOZh7Ege0yYG4MmlkqHRLAQAV2lHNH`
// set port, listen for requests
// const PORT = process.env.PORT || 3000;
app.listen(3000, async() => {
  console.log(`Server is running on 3000 port`);
  await Moralis.start({
    serverUrl: `https://hepeekqpfgaj.usemoralis.com:2053/server`,
    appId: `3FIDhZEnSGghRABLBfsj6RUNpcS7HVE7s8ErdO6Y`
  });
});


// https://obscure-crag-36363.herokuapp.com/

// "scripts": {
//   "test": "echo \"Error: no test specified\" && exit 1",
//   "start": "node server.js",
//   "devStart": "nodemon server.js"
// },