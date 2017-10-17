"use strict";
const sequelize = require('../domain/promoserver.prepare').sequelize;
const Sequelize = require('../domain/promoserver.prepare').Sequelize;
const TABLE_DEFINE = require("../domain/table.define");
const DomainBank = TABLE_DEFINE.DomainBank;
const DomainTrade = TABLE_DEFINE.DomainTrade;


var ModelFund = module.exports;


ModelFund.receiveListenerOfFund = function receiveListenerOfFund(fundInfo){
    switch(fundInfo.bankType){
    case "ETH":
        return receiveEthFund(fundInfo.data);
    case "BTC":
        return receiveBtcFund(fundInfo.data);
    default:
        throw new Error("unknown fund type");
    }
};

function receiveEthFund(fundData){
    let rez = [];
    return DomainTrade.bulkCreate(fundData.map((ele)=>{
        return {
            bankType:"ETH",
            bankAddress: ele.txTo,
            txHash: ele.txHash,
            fromAddress: ele.txFrom,
            toAddress: ele.txTo,
            amountInWei: ele.txValue,
            amountHuman: ele.txHuman
        };
    })).then((instanceArray)=>{
        return sequelize.query("update t_bank as tt set remain = ( select sum(amount_human) as remain from t_trade where tt.bank_address = bank_address );", {
            type:Sequelize.QueryTypes.UPDATE
        });
    }).then((bankUpdated)=>{
        return rez;
    });
};


function receiveBtcFund(fundData){
    let rez = [];
    return DomainTrade.bulkCreate(fundData.map((ele)=>{
        return {
            bankType:"BTC",
            bankAddress: ele.txTo,
            txHash: ele.txHash,
            fromAddress: ele.txFrom,
            toAddress: ele.txTo,
            amountInWei: ele.txValue,
            amountHuman: ele.txHuman
        };
    })).then((instanceArray)=>{
        return sequelize.query("update t_bank as tt set remain = ( select sum(amount_human) as remain from t_trade where tt.bank_address = bank_address );", {
            type:Sequelize.QueryTypes.UPDATE
        });
    }).then((bankUpdated)=>{
        return rez;
    });
};
