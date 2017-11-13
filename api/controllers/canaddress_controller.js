"use strict";

const canAccount = require("../models/canaddress.model");
const redis = require('../domain/promoserver.prepare').redis;
const KEYS = require("../models/oauth2.model").KEYS;


var ControllerAccountCan = module.exports;

ControllerAccountCan.updatePromoAccountCanAddress = function updatePromoAccountCanAddress(req, res){
    let canAddress = req.body.canAddress;
    let authUser = res.locals.oauth.token.user;
    console.log("\n    00 "+JSON.stringify(authUser));
    canAccount.updateCanAddress(canAddress,authUser).then((result) => {
        res.status(200);
        res.json({
            data: result
        });
    }).catch((error) => {
        res.status(460);
        res.json(error);
    });
};
