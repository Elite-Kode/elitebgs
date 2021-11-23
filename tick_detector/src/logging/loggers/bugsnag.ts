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

import { Logger } from '../logger';
import bugsnag, { Client } from '@bugsnag/js';
import bugsnagExpress from '@bugsnag/plugin-express';
import { LoggingClient } from '../index';

export class Bugsnag implements Logger {
  public loggerName = 'bugsnag';
  private client: Client;
  private readonly disabled: boolean;

  constructor(options: BugsnagOptions) {
    this.client = bugsnag.start({
      apiKey: options.apiKey,
      enabledReleaseStages: ['development', 'production'],
      plugins: [bugsnagExpress],
      appVersion: options.appVersion
    });
    this.disabled = !!options.disabled;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(data: string | Error, metadata?: { [key: string]: any }): void {
    LoggingClient.log(data, metadata, 'console');
    this.error(data, metadata);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(data: string | Error, metadata?: { [key: string]: any }): void {
    if (!this.disabled) {
      this.client.notify(data, (event) => {
        if (metadata) {
          event.addMetadata('Custom', metadata);
        }
      });
    }
  }
}

export interface BugsnagOptions {
  apiKey: string;
  appVersion: string;
  disabled?: boolean;
}
