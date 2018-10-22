let host = '';
let protocol = '';
if (process.env.NODE_ENV === 'development') {
    host = 'localhost:3001';
    protocol = 'http';
} else if (process.env.NODE_ENV === 'production') {
    host = 'elitebgs.kodeblox.com';
    protocol = 'https';
}

module.exports = {
    host, protocol
}
