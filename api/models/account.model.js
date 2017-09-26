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


ModelAccount.createPromoAccount = function createPromoAccount(accountData) {
    return sequelize.transaction((trans) => {
        let bankdata = {};
        return DomainAccount.create(accountData, {
            transaction: trans
        }).then((result) => {
            bankdata.account = result.toJSON();
            return DomainLibEth.findOne({
                where: {
                    status: {
                        $or: {
                            $eq: null,
                            $ne: USED
                        }
                    }
                },
                order: [
                    ["id", "ASC"]
                ],
                transaction: trans
            });
        }).then((ethIns) => {
            return ethIns.update({
                status: USED
            }, {
                transaction: trans
            });
        }).then((ethIns) => {
            bankdata.eth = ethIns.toJSON();
            return DomainLibBtc.findOne({
                where: {
                    status: {
                        $or: {
                            $eq: null,
                            $ne: USED
                        }
                    }
                },
                order: [
                    ["id", "ASC"]
                ],
                transaction: trans
            });
        }).then((btcIns) => {
            return btcIns.update({
                status: USED
            }, {
                transaction: trans
            });
        }).then((btcIns) => {
            bankdata.btc = btcIns.toJSON();
            return DomainBank.bulkCreate([{
                account: accountData.account,
                bankType: "ETH",
                bankAddress: bankdata.eth.address,
                status: "active"
            }, {
                account: accountData.account,
                bankType: "BTC",
                bankAddress: bankdata.btc.address,
                status: "active"
            }], {
                transaction: trans
            });
        }).then((bankInsArray) => {
            bankdata.banks = bankInsArray.map((ele) => ele.toJSON());
            return bankdata;
        });
    });
};