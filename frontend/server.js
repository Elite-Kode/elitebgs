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
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const secrets = require('./secrets');
const processVars = require('./processVars');
const bugsnagCaller = require('./server/bugsnag').bugsnagCaller;

const authCheck = require('./server/routes/auth/auth_check');
const authDiscord = require('./server/routes/auth/discord');
const authLogout = require('./server/routes/auth/logout');
const authUser = require('./server/routes/auth/auth_user');
const frontEnd = require('./server/routes/front_end');
const health = require('./server/routes/health');

const bugsnagClient = require('./server/bugsnag').bugsnagClient;

const app = express();

require('./server/db')

let bugsnagClientMiddleware = {}

if (secrets.bugsnag_use) {
    bugsnagClientMiddleware = bugsnagClient.getPlugin('express');
    app.use(bugsnagClientMiddleware.requestHandler);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
    name: "EliteBGS",
    secret: secrets.session_secret,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    store: new mongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth/check', authCheck);
app.use('/auth/discord', authDiscord);
app.use('/auth/logout', authLogout);
app.use('/auth/user', authUser);
app.use('/frontend', frontEnd);
app.use('/health', health);

// Pass all 404 errors called by browser to angular
app.all('*', (req, res) => {
    if (app.get('env') === 'development') {
        console.log(`Server 404 request: ${req.originalUrl}`);
    }
    res.status(200).sendFile(path.join(__dirname, 'dist', 'index.html'))
});

// error handlers
if (secrets.bugsnag_use) {
    app.use(bugsnagClientMiddleware.errorHandler);
}

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(logger('dev'));
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
    app.use(logger('combined'));
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
passport.deserializeUser(async (id, done) => {
    try {
        let model = require('./server/models/ebgs_users');
        let user = await model.findOne({ id: id })
        done(null, user);
    } catch (err) {
        bugsnagCaller(err);
        done(err);
    }
});

let onAuthentication = async (accessToken, refreshToken, profile, done, type) => {
    try {
        let model = require('./server/models/ebgs_users');
        let user = await model.findOne({ id: profile.id });
        if (user) {
            let updatedUser = {
                id: profile.id,
                username: profile.username,
                discriminator: profile.discriminator
            }
            if (user.avatar || user.avatar === null) {
                updatedUser.avatar = profile.avatar
            }
            try {
                await model.findOneAndUpdate(
                    { id: profile.id },
                    updatedUser,
                    {
                        upsert: false,
                        runValidators: true
                    });
                done(null, user);
            } catch (err) {
                bugsnagCaller(err);
                done(err);
            }
        } else {
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
                }
            };
            await model.findOneAndUpdate(
                { id: profile.id },
                user,
                {
                    upsert: true,
                    runValidators: true
                });
            if (secrets.discord_use) {
                await axios.post(`${secrets.companion_bot_endpoint}/new-member`, { id: profile.id });
            }
            done(null, user);
        }
    } catch (err) {
        bugsnagCaller(err);
        done(err);
    }
}

let onAuthenticationIdentify = (accessToken, refreshToken, profile, done) => {
    onAuthentication(accessToken, refreshToken, profile, done, 'identify');
}

passport.use('discord', new DiscordStrategy({
    clientID: secrets.client_id,
    clientSecret: secrets.client_secret,
    callbackURL: `${processVars.protocol}://${processVars.host}/auth/discord/callback`,
    scope: ['identify']
}, onAuthenticationIdentify));

module.exports = app;
