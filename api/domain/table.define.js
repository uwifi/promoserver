const Sequelize = require('./promoserver.prepare').Sequelize;
const sequelize = require('./promoserver.prepare').sequelize;
const redis = require('./promoserver.prepare').redis;

const KEYS = require("../models/oauth2.model").KEYS;

var model = module.exports;

model.DomainAccount = sequelize.define("t_account", {
    account: {
        type: Sequelize.STRING,
        unique: true
    },
    accountName: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    phone: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.INTEGER
    },
    avatar: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: "created_at"
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at"
    },
    status: {
        type: Sequelize.STRING
    },
    accountType: {
        type: Sequelize.STRING,
        field: "account_type"
    },
    country:{
        type:Sequelize.STRING,
        filed:'country'
    },
    firstName:{
        type:Sequelize.STRING,
        field:'first_name'
    },
    lastName:{
        type:Sequelize.STRING,
        field:'last_name'
    },
    idCardNumber:{
        type:Sequelize.STRING,
        field:'id_card_number'
    }
});
model.DomainLibEth = sequelize.define("t_lib_eth", {
    status: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING,
        unique: true
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: "created_at"
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at"
    }
});
model.DomainLibBtc = sequelize.define("t_lib_btc", {
    status: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING,
        unique: true
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: "created_at"
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at"
    }
});
model.DomainBank = sequelize.define("t_bank", {
    account: {
        type: Sequelize.STRING
    },
    bankType: {
        type: Sequelize.STRING,
        field: "bank_type"
    },
    bankAddress: {
        type: Sequelize.STRING,
        field: "bank_address",
        unique: true
    },
    remain: {
        type: Sequelize.DOUBLE
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: "created_at"
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at"
    },
    status: {
        type: Sequelize.STRING
    }
});
model.DomainTrade = sequelize.define("t_trade", {
    account: {
        type: Sequelize.STRING
    },
    bankType: {
        type: Sequelize.STRING,
        field: "bank_type"
    },
    bankAddress: {
        type: Sequelize.STRING,
        field: "bank_address"
    },
    txHash: {
        type: Sequelize.STRING,
        field: "tx_hash"
    },
    fromAddress: {
        type: Sequelize.STRING,
        field: "from_address"
    },
    toAddress: {
        type: Sequelize.STRING,
        field: "to_address"
    },
    amountAddress: {
        type: Sequelize.BIGINT,
        field: "amount_address"
    },
    amountInWei: {
        type: Sequelize.BIGINT,
        field: "amount_in_wei"
    },
    amountHuman: {
        type: Sequelize.DOUBLE,
        field: "amount_human"
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: "created_at"
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at"
    }
});
//各种交易表，根据需要添加


sequelize.sync({ force: false }).then(() => {
    model.DomainAccount.findOne().then((accountInstance) => {
        if (accountInstance == undefined) {
            return model.DomainAccount.create({
                account: "admin",
                appellation: "admin",
                password: "admin#20170829#ubc",
                accountType: "admin"
            });
        } else {
            return accountInstance;
        }
    }).then((accountInstance) => {
        let account = accountInstance.toJSON();
        let ar = {
            username: account.account,
            password: account.password,
            accountId: account.id
        };
        console.log('==================================PARAMETER=====================================');
        console.log(ar);
        let adminkey = `${KEYS.user}${account.account}`;
        console.log(adminkey);
        console.log('==================================   END   =====================================');
        return redis.hmsetAsync(adminkey, ar);
    }).catch((error) => {
        console.log(`init redis error:${error}`);
    });
});
