/*
 * KodeBlox Copyright 2017 Sayak Mukhopadhyay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http: //www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const passport = require('passport');
const basicStrategy = require('passport-http').BasicStrategy;
const DiscordStrategy = require('passport-discord').Strategy;
const secrets = require('./secrets');
const processVars = require('./processVars');

const bugsnag = require('./server/bugsnag');
const swagger = require('./server/swagger');

const bodiesV1 = require('./server/routes/eddb_api/v1/bodies');
const commoditiesV1 = require('./server/routes/eddb_api/v1/commodities');
const factionsV1 = require('./server/routes/eddb_api/v1/factions');
const populatedSystemsV1 = require('./server/routes/eddb_api/v1/populated_systems');
const stationsV1 = require('./server/routes/eddb_api/v1/stations');
const systemsV1 = require('./server/routes/eddb_api/v1/systems');

const downloadDumpsV1 = require('./server/routes/eddb_api/v1/download_dumps');
const insertDumpsV1 = require('./server/routes/eddb_api/v1/insert_dumps');
const updateDumpsV1 = require('./server/routes/eddb_api/v1/update_dumps');
const downloadInsertV1 = require('./server/routes/eddb_api/v1/download_insert');
const downloadUpdateV1 = require('./server/routes/eddb_api/v1/download_update');
const downloadUpdateV2 = require('./server/routes/eddb_api/v2/download_update');
const downloadUpdateV3 = require('./server/routes/eddb_api/v3/download_update');

const ebgsFactionsV1 = require('./server/routes/elite_bgs_api/v1/factions');
const ebgsSystemsV1 = require('./server/routes/elite_bgs_api/v1/systems');

const bodiesV2 = require('./server/routes/eddb_api/v2/bodies');
const factionsV2 = require('./server/routes/eddb_api/v2/factions');
const populatedSystemsV2 = require('./server/routes/eddb_api/v2/populated_systems');
const stationsV2 = require('./server/routes/eddb_api/v2/stations');
const systemsV2 = require('./server/routes/eddb_api/v2/systems');

const ebgsFactionsV2 = require('./server/routes/elite_bgs_api/v2/factions');
const ebgsSystemsV2 = require('./server/routes/elite_bgs_api/v2/systems');

const bodiesV3 = require('./server/routes/eddb_api/v3/bodies');
const factionsV3 = require('./server/routes/eddb_api/v3/factions');
const populatedSystemsV3 = require('./server/routes/eddb_api/v3/populated_systems');
const stationsV3 = require('./server/routes/eddb_api/v3/stations');
const systemsV3 = require('./server/routes/eddb_api/v3/systems');

const ebgsFactionsV3 = require('./server/routes/elite_bgs_api/v3/factions');
const ebgsSystemsV3 = require('./server/routes/elite_bgs_api/v3/systems');

const ebgsFactionsV4 = require('./server/routes/elite_bgs_api/v4/factions');
const ebgsSystemsV4 = require('./server/routes/elite_bgs_api/v4/systems');
const ebgsStationsV4 = require('./server/routes/elite_bgs_api/v4/stations');

const authCheck = require('./server/routes/auth/auth_check');
const authDiscord = require('./server/routes/auth/discord');
const authLogout = require('./server/routes/auth/logout');
const authUser = require('./server/routes/auth/auth_user');
const frontEnd = require('./server/routes/front_end');
const chartGenerator = require('./server/routes/chart_generator');

require('./server/modules/eddn');
require('./server/modules/discord');

const app = express();

app.use(bugsnag.requestHandler);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
    name: "EliteBGS",
    secret: secrets.session_secret,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    store: new mongoStore({ mongooseConnection: require('./server/db').elite_bgs })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/eddb/v1/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EDDBAPIv1);
});

app.use('/api/eddb/v2/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EDDBAPIv2);
});

app.use('/api/eddb/v3/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EDDBAPIv3);
});

app.use('/api/ebgs/v1/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EBGSAPIv1);
});

app.use('/api/ebgs/v2/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EBGSAPIv2);
});

app.use('/api/ebgs/v3/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EBGSAPIv3);
});

app.use('/api/ebgs/v4/api-docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.EBGSAPIv4);
});

// app.use('/api/eddb/v1/bodies', bodiesV1);
// app.use('/api/eddb/v1/commodities', commoditiesV1);
// app.use('/api/eddb/v1/factions', factionsV1);
// app.use('/api/eddb/v1/populatedsystems', populatedSystemsV1);
// app.use('/api/eddb/v1/stations', stationsV1);
// app.use('/api/eddb/v1/systems', systemsV1);
// app.use('/api/eddb/v1/downloaddumps', downloadDumpsV1);
// app.use('/api/eddb/v1/insertdumps', insertDumpsV1);
// app.use('/api/eddb/v1/updatedumps', updateDumpsV1);
// app.use('/api/eddb/v1/downloadinsert', downloadInsertV1);
// app.use('/api/eddb/v1/downloadupdate', downloadUpdateV1);

app.use('/api/eddb/v1/docs', swaggerUi.serve, swaggerUi.setup(swagger.EDDBAPIv1));
app.use('/api/eddb/v2/docs', swaggerUi.serve, swaggerUi.setup(swagger.EDDBAPIv2));
app.use('/api/eddb/v3/docs', swaggerUi.serve, swaggerUi.setup(swagger.EDDBAPIv3));
app.use('/api/ebgs/v1/docs', swaggerUi.serve, swaggerUi.setup(swagger.EBGSAPIv1));
app.use('/api/ebgs/v2/docs', swaggerUi.serve, swaggerUi.setup(swagger.EBGSAPIv2));
app.use('/api/ebgs/v3/docs', swaggerUi.serve, swaggerUi.setup(swagger.EBGSAPIv3));
app.use('/api/ebgs/v4/docs', swaggerUi.serve, swaggerUi.setup(swagger.EBGSAPIv4));

// app.use('/api/ebgs/v1/factions', ebgsFactionsV1);
// app.use('/api/ebgs/v1/systems', ebgsSystemsV1);

// app.use('/api/eddb/v2/bodies', bodiesV2);
// app.use('/api/eddb/v2/factions', factionsV2);
// app.use('/api/eddb/v2/populatedsystems', populatedSystemsV2);
// app.use('/api/eddb/v2/stations', stationsV2);
// app.use('/api/eddb/v2/systems', systemsV2);
// app.use('/api/eddb/v2/downloadupdate', downloadUpdateV2);

// app.use('/api/ebgs/v2/factions', ebgsFactionsV2);
// app.use('/api/ebgs/v2/systems', ebgsSystemsV2);

app.use('/api/eddb/v3/bodies', bodiesV3);
app.use('/api/eddb/v3/factions', factionsV3);
app.use('/api/eddb/v3/populatedsystems', populatedSystemsV3);
app.use('/api/eddb/v3/stations', stationsV3);
app.use('/api/eddb/v3/systems', systemsV3);
app.use('/api/eddb/v3/downloadupdate', downloadUpdateV3);

// app.use('/api/ebgs/v3/factions', ebgsFactionsV3);
// app.use('/api/ebgs/v3/systems', ebgsSystemsV3);

app.use('/api/ebgs/v4/factions', ebgsFactionsV4);
app.use('/api/ebgs/v4/systems', ebgsSystemsV4);
app.use('/api/ebgs/v4/stations', ebgsStationsV4);

app.use('/auth/check', authCheck);
app.use('/auth/discord', authDiscord);
app.use('/auth/logout', authLogout);
app.use('/auth/user', authUser);
app.use('/frontend', frontEnd);
app.use('/chartgenerator', chartGenerator);

// Pass all 404 errors called by browser to angular
app.all('*', (req, res) => {
    console.log(`Server 404 request: ${req.originalUrl}`);
    res.status(200).sendFile(path.join(__dirname, 'dist', 'index.html'))
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
        console.log(err);
    });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
    app.use(bugsnag.errorHandler);
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: {}
        });
    });
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    require('./server/models/ebgs_users')
        .then(model => {
            model.findOne({ id: id })
                .then(user => {
                    done(null, user);
                })
                .catch(err => {
                    done(err);
                })
        })
        .catch(err => {
            done(err);
        })
});

require('./server/models/users')
    .then(user => {
        passport.use(new basicStrategy((username, password, callback) => {
            user.findOne({ username: username })
                .then(user => {
                    if (user.password === password) {
                        return callback(null, user);
                    } else {
                        return callback(null, false);
                    }
                })
                .catch(err => {
                    console.log(err);
                    callback(err);
                })
        }));
    })
    .catch(err => {
        console.log(err);
    })

let onAuthentication = (accessToken, refreshToken, profile, done, type) => {
    const client = require('./server/modules/discord/client');
    const config = require('./server/models/configs');
    require('./server/models/ebgs_users')
        .then(model => {
            model.findOne({ id: profile.id })
                .then(user => {
                    if (user) {
                        let updatedUser = {
                            id: profile.id,
                            username: profile.username,
                            discriminator: profile.discriminator,
                            guilds: profile.guilds ? profile.guilds : user.guilds
                        };
                        if (user.email || type === 'email') {
                            updatedUser.email = profile.email;
                        }
                        if (user.avatar || user.avatar === null) {
                            updatedUser.avatar = profile.avatar
                        }
                        model.findOneAndUpdate(
                            { id: profile.id },
                            updatedUser,
                            {
                                upsert: false,
                                runValidators: true
                            })
                            .then(() => {
                                done(null, user);
                            })
                            .catch(err => {
                                done(err);
                            });
                    } else {
                        config.then(configModel => {
                            configModel.findOne()
                                .then(config => {
                                    let invite = client.guilds.get(config.guild_id).channels.get(config.invite_channel_id).createInvite({
                                        maxAge: 0,
                                        maxUses: 1,
                                        unique: true
                                    });
                                    invite.then(invitePromise => {
                                        let user = {
                                            id: profile.id,
                                            username: profile.username,
                                            avatar: profile.avatar,
                                            discriminator: profile.discriminator,
                                            access: 1,
                                            os_contribution: 0,
                                            patronage: {
                                                level: 0,
                                                since: null
                                            },
                                            invite: invitePromise.code,
                                            invite_used: false,
                                            guilds: profile.guilds ? profile.guilds : []
                                        };
                                        model.findOneAndUpdate(
                                            { id: profile.id },
                                            user,
                                            {
                                                upsert: true,
                                                runValidators: true
                                            })
                                            .then(() => {
                                                client.guilds.get(config.guild_id).channels.get(config.admin_channel_id).send("User " + profile.id + " has joined Elite BGS");
                                                done(null, user);
                                            })
                                            .catch(err => {
                                                done(err);
                                            });
                                    })
                                })
                                .catch(err => {
                                    done(err);
                                })
                        }).catch(err => {
                            done(err);
                        });
                    }
                })
        })
        .catch(err => {
            done(err);
        })
}

let onAuthenticationIdentify = (accessToken, refreshToken, profile, done) => {
    onAuthentication(accessToken, refreshToken, profile, done, 'identify');
}

let onAuthenticationEmail = (accessToken, refreshToken, profile, done) => {
    onAuthentication(accessToken, refreshToken, profile, done, 'email');
}

let onAuthenticationGuilds = (accessToken, refreshToken, profile, done) => {
    onAuthentication(accessToken, refreshToken, profile, done, 'guilds');
}

passport.use('discord', new DiscordStrategy({
    clientID: secrets.client_id,
    clientSecret: secrets.client_secret,
    callbackURL: `${processVars.protocol}://${processVars.host}/auth/discord/callback`,
    scope: ['identify']
}, onAuthenticationIdentify));

passport.use('discord-email', new DiscordStrategy({
    clientID: secrets.client_id,
    clientSecret: secrets.client_secret,
    callbackURL: `${processVars.protocol}://${processVars.host}/auth/discord/callbackemail`,
    scope: ['email']
}, onAuthenticationEmail));

passport.use('discord-guilds', new DiscordStrategy({
    clientID: secrets.client_id,
    clientSecret: secrets.client_secret,
    callbackURL: `${processVars.protocol}://${processVars.host}/auth/discord/callbackguilds`,
    scope: ['guilds']
}, onAuthenticationGuilds));

module.exports = app;
