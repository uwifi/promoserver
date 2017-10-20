"use strict";

const ModelFund = require("../models/fund.model");

var ControllerFund = module.exports;



ControllerFund.receiveListenerOfFund = function receiveListenerOfFund(req, res){
    let fund = req.body;
    if(fund.password == 'promob4067316-58ed-b82b-78ddd21f733e'){
        ModelFund.receiveListenerOfFund(fund).then((rs)=>{
            res.status(200);
            res.json({
                result:rs
            });
        }).catch((err)=>{
            res.status(500);
            res.json(err);
        });
    } else {
        res.status(401);
        res.json({
            msg:"authentiaction denied"
        });
    }
};
