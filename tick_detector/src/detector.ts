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

import io from 'socket.io';
import mongoose from 'mongoose';
import moment from 'moment';
import { DBSCAN } from 'density-clustering';
import { TickTimesModel } from './db/schemas/tickTimesV5';
import { ITickDetectorSchema, TickDetectorModel } from './db/schemas/tickDetector';
import { Server } from 'http';
import * as console from 'console';
import { TickSchema } from './typings/elitebgs';

export class Detector {
  private socket;
  private readonly freshness: number;
  private readonly threshold: number;
  private readonly delta: number;

  constructor(server: Server, freshness: number, threshold: number, delta: number) {
    this.socket = new io.Server(server, { pingTimeout: 30000, allowEIO3: true });

    this.socket.on('connection', function () {
      // Todo: do something on connection
      console.log(`New connection`);
    });

    this.freshness = freshness;
    this.threshold = threshold;
    this.delta = delta;
  }

  public async check(): Promise<void> {
    const mongoSession = await mongoose.startSession();
    await mongoSession.withTransaction(async () => {
      let start = moment().subtract(1, 'month').toDate();
      const lastTick: TickSchema = (await TickTimesModel.find({}).sort({ time: -1 }).limit(1).lean())[0];
      if (lastTick && lastTick.time) {
        start = moment(lastTick.time).subtract(1, 'day').toDate();
      }

      // @ts-ignore
      const tickData: ITickDetectorSchema[] = await TickDetectorModel.find({
        $and: [
          { delta: { $exists: true } },
          { delta: { $lte: this.freshness } },
          { first_seen: { $gte: start } },
          { influence: { $gt: 0 } }
        ]
      })
        .sort({ first_seen: -1 })
        .lean();

      const data = tickData
        // Filter out any duplicates, just for my sanity
        .filter(
          (element: ITickDetectorSchema, i: number, data: ITickDetectorSchema[]) =>
            data.findIndex(
              (subElement) =>
                subElement.system_id === element.system_id &&
                subElement.first_seen === element.first_seen &&
                subElement.delta === element.delta
            ) === i
        )
        .map((element: ITickDetectorSchema) => [+moment(element.first_seen).format('X')]);

      console.log(`Scanning ${tickData.length} items`);

      const dbscan = new DBSCAN();
      const clusters = dbscan.run(data, this.delta, this.threshold);

      for (const i in clusters) {
        const sorted = clusters[i].map((x) => data[x]).sort();
        const size = sorted.length;
        const start = moment(sorted[0], 'X');
        const detected = moment(sorted[this.threshold - 1], 'X');
        if (+i >= 1) {
          console.log(
            `Tick - ${start.format('YYYY-MM-DD HH:mm:ss')} - ${detected.format('YYYY-MM-DD HH:mm:ss')} - ${size} items`
          );
        }
      }
    });
    mongoSession.endSession();
  }
}
