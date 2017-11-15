"use strict";

const TABLE_DEFINE = require("../domain/table.define");
const redis = require('../domain/promoserver.prepare').redis;
const KEYS = require("../models/oauth2.model").KEYS;
const rf = require("fs"); 
const DomainBank = TABLE_DEFINE.DomainBank;
const DomainAccount = TABLE_DEFINE.DomainAccount;


var ControllerUpdateCanAmount = module.exports;

ControllerUpdateCanAmount.updatePromoAccountCan = function updatePromoAccountCan(req, res){
    let userPassword = req.params.password;
    if(userPassword == 'promoserver'){
        var data = JSON.parse(rf.readFileSync("subscriptionRatio.json","utf-8"));
        DomainAccount.findAll().then((totalAccount)=>{
                totalAccount.forEach((account)=> {
                        return DomainBank.findAll({
                            where:{
                            account: account.account
                            }
                        }).then(values => {
                            var eth_amount = 0;
                            var btc_amount = 0;
                            if(values.length == 0){
                                return;
                            }
                            if(values.length != 2){
                                throw {
                                    code: 10101,
                                    msg: "服务器错误"
                                };
                            }
                            values.forEach((bank)=>{
                                switch (bank.bankType) {
                                    case 'ETH':
                                    eth_amount = bank.remain;
                                    break;
                                    case 'BTC':
                                    btc_amount = bank.remain;
                                    break;
                                }
                            });
                            
                            var totalamount = eth_amount*data.eth + btc_amount*data.btc;
                            DomainAccount.update({
                                canAmount:totalamount
                            },{
                                where:{
                                     account: account.account
                                }
                            });
                        })
                    });
        });
        res.status(200);
        res.json({
            msg:"update success"
        });
    } else {
        res.status(401);
        res.json({
            msg:"authentiaction denied"
        });
    }
};

