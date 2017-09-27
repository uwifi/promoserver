"use strict";

const express = require("express"),
    bodyParser = require("body-parser"),
    oauthserver = require("express-oauth-server");
const ControllerAccount = require("./api/controllers/account_controller");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.oauth = new oauthserver({
    model: require('./api/models/oauth2.model')
});

app.post('/promo/token', app.oauth.token());

//-- authed
app.get('/promo/authed/account/ico/process', app.oauth.authenticate(), ControllerAccount.getAccountICOProcess);

//app.get('/ubc/bag/account/wallet/:projectAddress', app.oauth.authenticate(), ControllerAccount.getAccountWalletOfProjectAddress);
//app.post('/ubc/bag/account/wallet/item', app.oauth.authenticate(), ControllerAccount.createAccountBagItem);
//app.get('/ubc/bag/account/wallet/:projectAddress/item', app.oauth.authenticate(), ControllerAccount.queryAccountBagItem);

//app.post('/ubc/bag/account/wallet/currency', app.oauth.authenticate(), ControllerAccount.transferCurrency);

//-- authed end


//-- public
app.post('/promo/public/account', ControllerAccount.createPromoAccount);


//-- public end

var port = process.env.PORT || 8101;
app.listen(port);

console.log(`listen the port: ${port}`);
// for test
module.exports = app;
