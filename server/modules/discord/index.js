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
const bugsnagClient = require('../../bugsnag');
const secrets = require('../../../secrets');

client.login(secrets.discord_token);

client.on("ready", () => {
    console.log("Elite BGS Bot ready");
});

client.on("guildMemberAdd", member => {
    require('../../../server/models/ebgs_users')
        .then(model => {
            model.findOne({ id: member.id })
                .then(user => {
                    if (user) {
                        require('../../../server/models/configs')
                            .then(configModel => {
                                configModel.findOne()
                                    .then(config => {
                                        member.addRole(config.editor_role_id)
                                            .then(guildMember => {
                                                client.guilds.get(config.guild_id).channels.get(config.admin_channel_id).send("User " + member.id + " has been given the Editor role");
                                            })
                                            .catch(err => {
                                                bugsnagClient.notify(err, {
                                                    user: {
                                                        id: member.id,
                                                        username: member.user.username,
                                                        discriminator: member.user.discriminator
                                                    }
                                                });
                                                console.log(err);
                                            });
                                    })
                                    .catch(err => {
                                        bugsnagClient.notify(err, {
                                            user: {
                                                id: member.id,
                                                username: member.user.username,
                                                discriminator: member.user.discriminator
                                            }
                                        });
                                        console.log(err);
                                    });
                            }).catch(err => {
                                bugsnagClient.notify(err, {
                                    user: {
                                        id: member.id,
                                        username: member.user.username,
                                        discriminator: member.user.discriminator
                                    }
                                });
                                console.log(err);
                            });
                        user.invite = "";
                        user.invite_used = true;
                        model.findOneAndUpdate(
                            { id: member.id },
                            user,
                            {
                                upsert: false,
                                runValidators: true
                            })
                            .then(() => { })
                            .catch(err => {
                                bugsnagClient.notify(err, {
                                    user: {
                                        id: member.id,
                                        username: member.user.username,
                                        discriminator: member.user.discriminator
                                    }
                                });
                                console.log(err);
                            });
                    } else {
                        require('../../../server/models/configs')
                            .then(configModel => {
                                configModel.findOne()
                                    .then(config => {
                                        member.addRole(config.guest_role_id)
                                            .then(guildMember => {
                                                client.guilds.get(config.guild_id).channels.get(config.admin_channel_id).send("User " + member.id + " has been given the Guest role");
                                            })
                                            .catch(err => {
                                                bugsnagClient.notify(err, {
                                                    user: {
                                                        id: member.id,
                                                        username: member.user.username,
                                                        discriminator: member.user.discriminator
                                                    }
                                                });
                                                console.log(err);
                                            });
                                    })
                                    .catch(err => {
                                        bugsnagClient.notify(err, {
                                            user: {
                                                id: member.id,
                                                username: member.user.username,
                                                discriminator: member.user.discriminator
                                            }
                                        });
                                        console.log(err);
                                    })
                            }).catch(err => {
                                bugsnagClient.notify(err, {
                                    user: {
                                        id: member.id,
                                        username: member.user.username,
                                        discriminator: member.user.discriminator
                                    }
                                });
                                console.log(err);
                            });
                    }
                })
        })
        .catch(err => {
            bugsnagClient.notify(err, {
                user: {
                    id: member.id,
                    username: member.user.username,
                    discriminator: member.user.discriminator
                }
            });
            console.log(err);
        })
});
