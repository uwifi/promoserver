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
        return receiveBitFund(fundInfo.data,"ETH");
    case "BTC":
        return receiveBitFund(fundInfo.data,"BTC");
    default:
        throw new Error("unknown fund type");
    }
};

function receiveBitFund(fundData,bankType){

    console.log('\n------------------receive data:'+JSON.stringify(fundData)+'------------------');
    let rez = [];
    fundData.forEach(
        function(ele){  
            var date = {
                bankType:bankType,
                bankAddress: ele.txTo,
                txHash: ele.txHash,
                fromAddress: ele.txFrom,
                toAddress: ele.txTo,
                amountInWei: ele.txValue,
                amountHuman: ele.txHuman
            };
            DomainTrade.insertOrUpdate(date);
        }
    );
    return sequelize.query("update t_bank as tt set remain = ( select sum(amount_human) as remain from t_trade where tt.bank_address = bank_address );", {
            type:Sequelize.QueryTypes.UPDATE
        }).then(()=>{
        return rez;
    });
};