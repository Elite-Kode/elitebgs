let host = '';
let protocol = '';
let nossr = false;
if (process.env.NODE_ENV === 'development') {
    host = 'localhost:3001';
    protocol = 'http';
} else if (process.env.NODE_ENV === 'production') {
    host = 'elitebgs.kodeblox.com';
    protocol = 'https';
}

if (process.argv.indexOf('nossr') !== -1) {
    nossr = true;
}

module.exports = {
    host, protocol, nossr
}
