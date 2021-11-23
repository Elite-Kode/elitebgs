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

import mongoose, { connect, connection, ConnectOptions } from 'mongoose';
import { LoggingClient } from '../logging';

export type DbOptions = {
  username: string;
  password: string;
  host: string;
};

export class Db {
  private readonly options: ConnectOptions;
  private readonly host: string;

  constructor(options: DbOptions) {
    this.host = options.host;
    this.options = {
      keepAlive: true,
      keepAliveInitialDelay: 120000,
      user: options.username,
      pass: options.password
    };
  }

  public async connectToDB(): Promise<typeof mongoose> {
    this.listenToEvents();
    return connect(this.host, this.options);
  }

  private listenToEvents(): void {
    connection.on('connected', () => {
      LoggingClient.log(`Connected to ${this.host}`, null, 'console');
    });

    connection.on('error', (err) => {
      LoggingClient.log(`Mongoose error ${err}`);
    });

    connection.on('disconnected', () => {
      LoggingClient.log('Mongoose connection disconnected');
    });

    process.on('SIGINT', async () => {
      await connection.close();
      LoggingClient.log('Connection closed via app termination', null, 'console');
      process.exit(0);
    });
  }
}
