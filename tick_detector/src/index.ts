/*
 * Copyright 2021 Sayak Mukhopadhyay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { config } from 'dotenv';
import { AppServer } from './server';
import { LoggingClient } from './logging';
import { Bugsnag } from './logging/loggers/bugsnag';

config();

LoggingClient.registerLogger(
  new Bugsnag({
    // @ts-ignore
    apiKey: process.env.BUGSNAG_TOKEN ?? '',
    appVersion: '0.0.1',
    // @ts-ignore
    disabled: process.env.BUGSNAG_ENABLED !== 'true'
  }),
  true
);

const appServer = new AppServer({
  // @ts-ignore
  port: process.env.PORT,
  db: {
    // @ts-ignore
    username: process.env.ELITE_BGS_DB_USER,
    // @ts-ignore
    password: process.env.ELITE_BGS_DB_PASSWPRD,
    // @ts-ignore
    host: process.env.ELITE_BGS_DB_HOST
  }
});
appServer.server.on('listening', () => {
  console.log('weeheee');
});
