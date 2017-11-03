"use strict";

const sequelize = require('../domain/promoserver.prepare').sequelize;
const redis = require('../domain/promoserver.prepare').redis;
const KEYS = require("./oauth2.model").KEYS;
const TABLE_DEFINE = require("../domain/table.define");
const DomainAccount = TABLE_DEFINE.DomainAccount;
const DomainLibEth = TABLE_DEFINE.DomainLibEth;
const DomainLibBtc = TABLE_DEFINE.DomainLibBtc;
const DomainBank = TABLE_DEFINE.DomainBank;

var ModelAccount = module.exports;

const USED = "used";

ModelAccount.updateCanAddress = function updateCanAddress(canaddress,authUser) {
    return DomainAccount.update(
        {receiveCanAddress:canaddress},
        {where:{account: authUser.id}
    }).then((result) => {
        console.log(JSON.stringify(result));
        return result;
    });
};

