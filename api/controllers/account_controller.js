"use strict";

const ModelAccount = require("../models/account.model");
const redis = require('../domain/promoserver.prepare').redis;
const KEYS = require("../models/oauth2.model").KEYS;


var ControllerAccount = module.exports;

ControllerAccount.createPromoAccount = function createPromoAccount(req, res){
    let account = req.body;
    let signup = {};
    checkoutAccount(account).then((accountIsOk) => {
        return ModelAccount.createPromoAccount({
            account: account.account.trim(),
            email: account.email.trim(),
            password: account.password.trim(),
            country:account.country,
            firstName:account.firstName,
            lastName:account.lastName,
            idCardNumber:account.idCardNumber,
            phone:account.phone
        }, req, res);
    }).then((bankdata)=>{
        Object.assign(signup, bankdata);
        return redis.hmsetAsync(`${KEYS.user}${account.account}`, {
            username: bankdata.account.account,
            password: bankdata.account.password,
            accountId: bankdata.account.id
        });
    }).then(()=>{
        res.status(200);
        res.json(signup);
    }).catch((error) => {
        res.status(460);
        res.json(error);
    });
};


function checkoutAccount(account) {
    return new Promise((resolve, reject) => {
        let isOk = account.account && account.account.trim().length > 5;
        if (!isOk) {
            reject({
                code: 10001,
                message: "账号长度应该超过5位"
            });
        };
        isOk = isOk && account.email && account.email.indexOf("@") > 0;
        if(!isOk){
            reject({
                code: 10002,
                message: "邮箱格式错误"
            });
        };
        isOk = isOk && account.password && (account.password.length > 6 || account.password.length < 200);
        if (!isOk) {
            reject({
                code: 10003,
                message: "密码不符合要求"
            });
        };
        resolve(isOk);
    });
};

ControllerAccount.getAccountICOProcess = function getAccountICOProcess(req, res){
    let authUser = res.locals.oauth.token.user;
    ModelAccount.getAccountICOProcess(authUser).then((icoBankJSON)=>{
        res.status(200);
        res.json({
            data: icoBankJSON
        });
    });
};
