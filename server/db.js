"use strict";

let mongoose = require('mongoose');

let user = process.env.db_uname || "elite_bgs_readwrite";
let pass = process.env.db_pass || "damndifficultpassword";

let url = process.env.dbURL || "mongodb://localhost:27017/elite_bgs";

let options = {
    server: {
        socketOptions: {
            keepAlive: 120
        }
    },
    user,
    pass
}

function connect() {
    mongoose.connect(url, options, (err, db) => {
        if (err) {
            return console.log(err);
        }
    });
}

connect();

module.exports.mongoose = mongoose;
module.exports.connect = connect;