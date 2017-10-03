"use strict";

const ModelFund = require("../models/fund.model");

var ControllerFund = module.exports;



ControllerFund.receiveListenerOfFund = function receiveListenerOfFund(req, res){
    let fund = req.body;
    ModelFund.receiveListenerOfFund(fund).then((rs)=>{
        res.status(200);
        res.json({
            result:rs
        });
    }).catch((err)=>{
        res.status(500);
        res.json(err);
    });;
};
