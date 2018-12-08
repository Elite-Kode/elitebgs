let host = '';
let protocol = '';
if (process.env.NODE_ENV === 'development') {
    host = 'localhost:3001';
    protocol = 'http';
} else if (process.env.NODE_ENV === 'production') {
    host = 'elitebgs.kodeblox.com';
    protocol = 'https';
}

let version = require('./server/version');

module.exports = {
    host, protocol, version
}
