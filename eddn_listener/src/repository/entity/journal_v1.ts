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

/**
 * This EDDN Journal schema was automatically generated from
 * https://raw.githubusercontent.com/EDCD/EDDN/master/schemas/journal-v1.0.json
 * by
 * https://app.quicktype.io/?l=ts
 */
export interface EDDNJournalV1 {
  schemaRef?: string
  header?: Header
  message?: Message
}

export interface Header {
  gatewayTimestamp?: Date
  softwareName?: string
  softwareVersion?: string
  uploaderID?: string
}

export interface Message {
  Body?: string
  BodyID?: number
  BodyType?: string
  Conflicts?: Conflict[]
  DistFromStarLS?: number
  Docked?: boolean
  event?: string
  Factions?: FactionElement[]
  Horizons?: boolean
  LandingPads?: LandingPads
  MarketID?: number
  Multicrew?: boolean
  odyssey?: boolean
  Population?: number
  StarPos?: number[]
  StarSystem?: string
  StationEconomies?: StationEconomy[]
  StationEconomy?: string
  StationFaction?: FactionClass
  StationGovernment?: string
  StationName?: string
  StationServices?: string[]
  StationType?: string
  SystemAddress?: number
  SystemAllegiance?: string
  SystemEconomy?: string
  SystemFaction?: FactionClass
  SystemGovernment?: string
  SystemSecondEconomy?: string
  SystemSecurity?: string
  Taxi?: boolean
  timestamp?: Date
}

export interface FactionConflict {
  Name?: string
  Stake?: string
  WonDays?: number
}

export interface Conflict {
  Faction1?: FactionConflict
  Faction2?: FactionConflict
  Status?: string
  WarType?: string
}



export interface IngState {
  state?: string
  trend?: number
}

export interface StationEconomy {
  name?: string
  proportion?: number
}

export interface FactionElement {
  allegiance?: string
  factionState?: string
  government?: string
  happiness?: string
  influence?: number
  name?: string
  recoveringStates?: IngState[]
  activeStates?: ActiveState[]
  pendingStates?: IngState[]
}

export interface ActiveState {
  State: string
}

export interface LandingPads {
  large?: number
  medium?: number
  small?: number
}

export interface FactionClass {
  FactionState?: string
  Name?: string
}
