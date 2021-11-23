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

import { Logger } from './logger';
import { Console } from './loggers/console';

export class LoggingClient {
  public static defaultLogger: Logger = new Console();
  public static loggers: Logger[] = [LoggingClient.defaultLogger];

  public static registerLogger(logger: Logger, isDefault = false): void {
    LoggingClient.loggers.push(logger);
    if (isDefault) {
      LoggingClient.defaultLogger = logger;
    }
  }

  public static log(data: string | Error | unknown, metadata?: unknown, loggerName?: string): void {
    if (loggerName) {
      const logger = LoggingClient.loggers.find((logger) => logger.loggerName === loggerName);
      if (logger) {
        logger.log(data, metadata);
      } else {
        throw new Error(`Logger with name ${loggerName} not found`);
      }
    } else {
      LoggingClient.defaultLogger.log(data, metadata);
    }
  }

  public static error(data: string | Error | unknown, metadata?: unknown, loggerName?: string): void {
    if (loggerName) {
      const logger = LoggingClient.loggers.find((logger) => logger.loggerName === loggerName);
      if (logger) {
        logger.error(data, metadata);
      } else {
        throw new Error(`Logger with name ${loggerName} not found`);
      }
    } else {
      LoggingClient.defaultLogger.error(data, metadata);
    }
  }
}
