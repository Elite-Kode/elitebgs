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

const client = require('./client');
const bugsnagCaller = require('../../bugsnag').bugsnagCaller;
const secrets = require('../../../secrets');

client.login(secrets.discord_token);

client.on("ready", () => {
    console.log("Elite BGS Bot ready");
});

client.on("guildMemberAdd", async member => {
    try {
        let model = await require('../../../server/models/ebgs_users');
        let user = await model.findOne({
            id: member.id
        });
        let configModel = await require('../../../server/models/configs');
        let config = await configModel.findOne();
        await member.addRole(config.user_role_id);
        if (user) {
            client.guilds.get(config.guild_id).channels.get(config.admin_channel_id).send("Registered user " + member.id + " has joined");
        } else {
            client.guilds.get(config.guild_id).channels.get(config.admin_channel_id).send("Unregistered user " + member.id + " has joined");
        }
    } catch (err) {
        bugsnagCaller(err);
    }
});

client.on("error", err => {
    bugsnagCaller(err);
})
