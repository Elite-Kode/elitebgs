/*
 * Copyright 2021 Elite Kode development team, Kode Blox, and Sayak Mukhopadhyay
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

'use strict'

import * as _ from 'lodash'
import * as axios from 'axios'
import * as semver from 'semver'
import * as mongoose from 'mongoose'
import * as bugsnag from '../bugsnag'

import { FactionModel } from '../repository/mongoose-model/ebgs_factions_v5'
import { SystemModel } from '../repository/mongoose-model/ebgs_systems_v5'
import { StationModel } from '../repository/mongoose-model/ebgs_stations_v5'
import { HistoryFactionModel } from '../repository/mongoose-model/ebgs_history_faction_v5'
import { HistorySystemModel } from '../repository/mongoose-model/ebgs_history_system_v5'
import { HistoryStationModel } from '../repository/mongoose-model/ebgs_history_station_v5'
import { ConfigModel } from '../repository/mongoose-model/configs'

import * as systemDomain from '../domain/system'
import * as journal from '../repository/entity/journal_v1'

import { nonBGSFactions } from './nonBGSFactions'

const bugsnagCaller = bugsnag.bugsnagCaller

function Journal(): void {
  this.schemaId = ['https://eddn.edcd.io/schemas/journal/1']


}

export { Journal }
