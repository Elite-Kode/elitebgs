const BugsnagSourceMapUploaderPlugin = require('webpack-bugsnag-plugins').BugsnagSourceMapUploaderPlugin;
const secrets = require('./secrets');
const processVars = require('./processVars');

let plugins = [];

if (secrets.bugsnag_sourcemap_send) {
    plugins = [
        new BugsnagSourceMapUploaderPlugin({
            apiKey: secrets.bugsnag_token_angular,
            appVersion: processVars.version,
            overwrite: true,
            publicPath: `${processVars.protocol}://${processVars.host}/`,
            deleteSourceMaps: true
        })
    ];
}

module.exports = {
    plugins: plugins
};
