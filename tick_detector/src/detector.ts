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

export async function initiateSocket(
  server: Server,
  freshness: number,
  threshold: number,
  delta: number
): Promise<void> {
  const socket = new io.Server(server, { pingTimeout: 30000, allowEIO3: true });

  socket.on('connection', function () {
    // Todo: do something on connection
    console.log(`New connection`);
  });

  const mongoSession = await mongoose.startSession();
  await mongoSession.withTransaction(async () => {
    let start: string | Date = moment().subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ssZ');
    const lastTick = TickTimesModel.find({}).sort({ time: -1 }).limit(1).lean()[0];
    if (lastTick) {
      start = moment(lastTick).toDate();
    }

    // @ts-ignore
    const tickData: ITickDetectorSchema[] = await TickDetectorModel.find({
      $and: [
        { delta: { $exists: true } },
        { delta: { $lte: freshness } },
        { first_seen: { $gte: start } },
        { influence: { $gt: 0 } }
      ]
    })
      .sort({ first_seen: -1 })
      .lean();

    const data = tickData
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

    const dbscan = new DBSCAN();
    const clusters = dbscan.run(data, delta, threshold);

    for (const i in clusters) {
      const sorted = clusters[i].map((x) => data[x]).sort();
      const size = sorted.length;
      const start = moment(sorted[0], 'X');
      const detected = moment(sorted[threshold - 1], 'X');
      if (+i >= 1) {
        console.log(
          `Tick - ${start.format('YYYY-MM-DD HH:mm:ss')} - ${detected.format('YYYY-MM-DD HH:mm:ss')} - ${size} items`
        );
        socket.emit('tick', start.format('YYYY-MM-DDTHH:mm:ssZ'));
      }
    }
  });
  mongoSession.endSession();
}
