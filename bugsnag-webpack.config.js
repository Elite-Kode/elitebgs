const BugsnagSourceMapUploaderPlugin = require('webpack-bugsnag-plugins').BugsnagSourceMapUploaderPlugin;
const secrets = require('./secrets');

let plugins = [];

if (secrets.bugsnag_sourcemap_send) {
    plugins = [
        new BugsnagSourceMapUploaderPlugin({
            apiKey: secrets.bugsnag_token_angular,
            appVersion: require('./server/version'),
            overwrite: true,
            publicPath: 'dist',
            deleteSourceMaps: true
        })
    ];
}

module.exports = {
    plugins: plugins
};
