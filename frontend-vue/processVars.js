let host = '';
let protocol = '';
if (process.env.NODE_ENV === 'development') {
    host = 'localhost:3014';
    protocol = 'http';
} else if (process.env.NODE_ENV === 'production') {
    host = 'elitebgs.app';
    protocol = 'https';
}

let version = require('./version');

module.exports = {
    host, protocol, version
}
