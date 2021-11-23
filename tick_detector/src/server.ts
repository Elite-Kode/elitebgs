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

import express, { Application } from 'express';
import morgan from 'morgan';
import http, { Server } from 'http';
import { AddressInfo } from 'net';
import { Db, DbOptions } from './db';
import { LoggingClient } from './logging';
import { Detector } from './detector';

export type Options = {
  port?: number;
  db: DbOptions;
};

export class AppServer {
  get server(): Server {
    return this._server;
  }
  public express: Application;
  public port: number;
  public db: Db;
  public detector: Detector;
  private readonly _server: Server;
  private readonly freshness = 14400;
  private readonly threshold = 5;
  private readonly delta = 7500;

  constructor(options: Options) {
    this.express = express();
    this.port = options?.port || 8080;
    this.express.use(morgan('dev'));

    this.db = new Db(options.db);
    this.db.connectToDB();

    this.express.set('port', this.port);
    this._server = http.createServer(this.express);
    this._server.listen(this.port);
    this._server.on('error', this.onError.bind(this));
    this._server.on('listening', this.onListening.bind(this));

    this.detector = new Detector(this._server, this.freshness, this.threshold, this.delta);

    this.detector.check();
    setInterval(this.detector.check, 60000);
  }

  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    switch (error.code) {
      case 'EADDRINUSE':
        LoggingClient.error(`Port ${this.port} is already in use`, null, 'console');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private onListening(): void {
    const address = this._server.address() as AddressInfo;
    if (address) {
      LoggingClient.log(`Listening on port ${address.port}`, null, 'console');
    }
  }
}
