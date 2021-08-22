
import * as _ from 'lodash'
import * as axios from 'axios'
import * as semver from 'semver'
import * as mongoose from 'mongoose'
import * as bugsnag from '../bugsnag'

import * as journal from '../repository/entity/journal_v1'

import { FactionModel } from '../repository/mongoose-model/ebgs_factions_v5'
import { HistoryFactionModel } from '../repository/mongoose-model/ebgs_history_faction_v5'

import { SystemModel } from '../repository/mongoose-model/ebgs_systems_v5'
import { HistorySystemModel } from '../repository/mongoose-model/ebgs_history_system_v5'

import { StationModel } from '../repository/mongoose-model/ebgs_stations_v5'
import { HistoryStationModel } from '../repository/mongoose-model/ebgs_history_station_v5'

import { ConfigModel } from '../repository/mongoose-model/configs'

import { nonBGSFactions } from './nonBGSFactions'

setSystemRecord = async (systemAddress, systemObject) => {
    return await SystemModel.findOneAndUpdate(
      {
        system_address: systemAddress
      },
      systemObject,
      {
        upsert: true,
        runValidators: true,
        new: true
      }
    ).lean()
  }

  async function setSystemHistory(historyObject) => {
    const document = new HistorySystemModel(historyObject)
    await document.save()
  }

  function correctCoordinates(value: string): number {
    const floatValue = Number.parseFloat(value)
    const intValue = Math.round(floatValue * 32)
    return intValue / 32
  }

  async function checkMessageJump(message: journal.Message, header: journal.Header): boolean {
    if (
      message.StarSystem &&
      message.SystemFaction &&
      typeof message.SystemFaction !== 'string' &&
      !(message.SystemFaction instanceof String) &&
      message.SystemAddress &&
      message.timestamp &&
      message.SystemSecurity &&
      message.SystemAllegiance &&
      message.SystemEconomy &&
      message.StarPos &&
      message.Factions &&
      message.event &&
      message.SystemGovernment
    ) {
      if (!message.SystemFaction.FactionState) {
        message.SystemFaction.FactionState = 'None'
      }
      if (!message.Population) {
        message.Population = 0
      }
      if (!message.Conflicts) {
        message.Conflicts = []
      }
      const configRecord = await ConfigModel.findOne({}).lean()
      if (
        configRecord.blacklisted_software.findIndex((software) => {
          const regexp = new RegExp(software, 'i')
          return regexp.test(header.softwareName)
        }) !== -1
      ) {
        throw new Error('Message from blacklisted software ' + header.softwareName)
      }
      let pass = true
      configRecord.version_software.forEach((software) => {
        if (header.softwareName.toLowerCase() === software.name.toLowerCase()) {
          if (semver.lt(semver.coerce(header.softwareVersion), semver.coerce(software.version))) {
            pass = false
          }
        }
      })
      if (!pass) {
        throw new Error('Message from old version ' + header.softwareVersion + ' software ' + header.softwareName)
      }
      if (
        configRecord.whitelisted_software.findIndex((software) => {
          const regexp = new RegExp(software, 'i')
          return regexp.test(header.softwareName)
        }) === -1
      ) {
        throw new Error('Message not from whitelisted software ' + header.softwareName)
      }
      const messageTimestamp = new Date(message.timestamp)
      const oldestTimestamp = new Date('2017-10-07T00:00:00Z')
      const currentTimestamp = new Date(Date.now() + configRecord.time_offset)
      if (messageTimestamp < oldestTimestamp || messageTimestamp > currentTimestamp) {
        throw new Error('Message timestamp too old or in the future')
      }
    } else {
      throw new Error('Message is not valid')
    }
  }

  function checkSystemWHistory(message: journal.Message, history: array, factionArray, conflictsArray) : boolean {
    for (const item of history) {
      if (
        item.government === message.SystemGovernment.toLowerCase() &&
        item.allegiance === message.SystemAllegiance.toLowerCase() &&
        item.state === message.SystemFaction.FactionState.toLowerCase() &&
        item.security === message.SystemSecurity.toLowerCase() &&
        item.population === message.Population &&
        item.controlling_minor_faction === message.SystemFaction.Name.toLowerCase() &&
        item.conflicts &&
        _.isEqual(
          _.sortBy(item.conflicts, ['faction1.name_lower']),
          _.sortBy(conflictsArray, ['faction1.name_lower'])
        ) &&
        _.isEqual(_.sortBy(item.factions, ['name_lower']), _.sortBy(factionArray, ['name_lower']))
      ) {
        return false
      }
    }
    return true
  }

  async function getSystemEDDBIdByAddress(systemAddress: number) {
    const url = 'https://eddbapi.kodeblox.com/api/v4/populatedsystems'
    const requestConfig: axios.AxiosRequestConfig = {
      url: url,
      params: {
        systemaddress: systemAddress
      }
    }
    try {
      const response = await axios.default.get(url, requestConfig)
      if (response.status === 200) {
        const responseObject = JSON.parse(response.data)

        if (responseObject.count > 0) {
          return responseObject.docs[0].id
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }



function createBasicSystem(message: journal.Message ){ 
    let system = await setSystemRecord(message.SystemAddress, {
        name: message.StarSystem,
        name_lower: message.StarSystem.toLowerCase(),
        system_address: message.SystemAddress,
        x: correctCoordinates(message.StarPos[0]),
        y: correctCoordinates(message.StarPos[1]),
        z: correctCoordinates(message.StarPos[2]),
        primary_economy: message.SystemEconomy,
        secondary_economy: message.SystemSecondEconomy
      })
}

trackSystem = async (message, header) => {
    const mongoSession = await mongoose.startSession()
    if (message.event === 'FSDJump' || message.event === 'Location' || message.event === 'CarrierJump') {
      try {
        // Check if the message is well formed
        await checkMessageJump(message, header)

        // Filter out factions that don't contribute to the BGS
        message.Factions = message.Factions.filter((faction) => {
          return nonBGSFactions.indexOf(faction.Name) === -1
        })
        await mongoSession.withTransaction(async () => {
          // First get the system from the db which matches the system address
          let system = await SystemModel.findOne({
            system_address: message.SystemAddress
          }).lean()
          if (!system) {
            // If no system with the system address is found, create a basic system
            createBasicSystem(message)
          }

          // Get the faction records next
          const factions = await Promise.all(
            message.Factions.map(async (messageFaction) => {
              // First try to get the faction data
              const factionNameLower = messageFaction.Name.toLowerCase()
              let faction = await FactionModel.findOne({
                name_lower: factionNameLower
              }).lean()
              if (!faction) {
                // If no faction with the name is found, create a basic faction
                faction = await setFactionRecord(factionNameLower, {
                  name: messageFaction.Name,
                  name_lower: factionNameLower,
                  government: messageFaction.Government,
                  allegiance: messageFaction.Allegiance
                })
              }
              return faction
            })
          )

          // Generate the faction array that needs to be inserted
          const factionArray = message.Factions.map((faction) => {
            return {
              name: faction.Name,
              name_lower: faction.Name.toLowerCase(),
              faction_id: factions.find((dbfaction) => {
                return dbfaction.name_lower === faction.Name.toLowerCase()
              })._id
            }
          })

          // Get the list of stations that are at stake in an ongoing conflict
          const stationsAtStake = _.flatten(
            message.Conflicts.map((conflict) => {
              return [conflict.Faction1.Stake.toLowerCase(), conflict.Faction2.Stake.toLowerCase()]
            })
          )
          // Get the station records of the stations that are at stake
          const stations = await StationModel.find({
            name_lower: {
              $in: stationsAtStake
            },
            system_id: {
              $in: [system._id]
            }
          }).lean()

          // Generate the conflicts array that needs to be inserted
          const conflictsArray = message.Conflicts.map((conflict) => {
            return {
              type: conflict.WarType,
              status: conflict.Status,
              faction1: {
                faction_id: factions.find((dbFaction) => {
                  return dbFaction.name_lower === conflict.Faction1.Name.toLowerCase()
                })._id,
                name: conflict.Faction1.Name,
                name_lower: conflict.Faction1.Name.toLowerCase(),
                station_id: _.get(
                  stations.find((dbStation) => {
                    return (
                      dbStation.system_id.equals(system._id) &&
                      dbStation.name_lower === conflict.Faction1.Stake.toLowerCase()
                    )
                  }),
                  '_id',
                  null
                ), // Get the station id of the station if it exists in db else null
                stake: conflict.Faction1.Stake,
                stake_lower: conflict.Faction1.Stake.toLowerCase(),
                days_won: conflict.Faction1.WonDays
              },
              faction2: {
                faction_id: factions.find((dbFaction) => {
                  return dbFaction.name_lower === conflict.Faction2.Name.toLowerCase()
                })._id,
                name: conflict.Faction2.Name,
                name_lower: conflict.Faction2.Name.toLowerCase(),
                station_id: _.get(
                  stations.find((dbStation) => {
                    return (
                      dbStation.system_id.equals(system._id) &&
                      dbStation.name_lower === conflict.Faction2.Stake.toLowerCase()
                    )
                  }),
                  '_id',
                  null
                ),
                stake: conflict.Faction2.Stake,
                stake_lower: conflict.Faction2.Stake.toLowerCase(),
                days_won: conflict.Faction2.WonDays
              }
            }
          })
          const returnedSystem = await formAndSetSystemRecord(message, system, factionArray, conflictsArray)
          // The above function returns undefined when an update operation hasn't happened.
          if (returnedSystem) {
            system = returnedSystem
          }
          await formAndSetFactionRecord(message, factions, stations, system)
        })
      } catch (err) {
        if (err.message !== 'Message is not valid') {
          bugsnagCaller(err, {
            metaData: {
              message: message
            }
          })
        }
      }
    }
    if (message.event === 'Docked' || (message.event === 'Location' && message.Docked)) {
      try {
        // Check if the message is well formed
        await checkMessageDock(message, header)

        // Create the array to store the station services
        const serviceArray = message.StationServices.map((service) => {
          return {
            name: service,
            name_lower: service.toLowerCase()
          }
        })
        await mongoSession.withTransaction(async () => {
          // First, try to get the system record for this station which matches the system address
          const system = await SystemModel.findOne({
            system_address: message.SystemAddress
          }).lean()
          // Try to get the faction record for the station owner
          const faction = await FactionModel.findOne({
            name_lower: message.StationFaction.Name.toLowerCase()
          }).lean()

          // If the system or faction for this station doesn't exist in the db yet, don't proceed
          if (!system || !faction) {
            throw new Error('System or faction for station not present: ' + JSON.stringify(message))
          }

          // Get the station from the db which matches the market id
          let station = await StationModel.findOne({
            market_id: message.MarketID
          }).lean()

          if (!station) {
            // If no station with the market id us found, create a basic station
            station = await setStationRecord(message.MarketID, {
              name: message.StationName,
              name_lower: message.StationName.toLowerCase(),
              market_id: message.MarketID,
              system: message.StarSystem,
              system_lower: message.StarSystem.toLowerCase(),
              system_id: system._id,
              economy: message.StationEconomy,
              all_economies: message.StationEconomies.map((economy) => {
                return {
                  name: economy.Name,
                  proportion: economy.Proportion
                }
              }),
              distance_from_star: message.DistFromStarLS
            })
          }
          await formAndSetStationRecord(message, station, faction, serviceArray)
        })
      } catch (err) {
        if (err.message !== 'Message is not valid') {
          bugsnagCaller(err, {
            metaData: {
              message: message
            }
          })
        }
      }
    }
    mongoSession.endSession()
  }

formAndSetSystemRecord = async (message, system, factionArray, conflictsArray) => {
    // Check if all the parameters are valid
    if (message && system && factionArray.length > 0 && conflictsArray) {
      // Get the faction id of the controlling faction
      const controllingFactionId = _.get(
        factionArray.find((currentFaction) => {
          return currentFaction.name_lower === message.SystemFaction.Name.toLowerCase()
        }),
        'faction_id',
        null
      )

      // Sets the system_address and secondary economy for systems that don't have them yet
      if (!system.system_address || !system.secondary_economy) {
        system.system_address = message.SystemAddress
        system.secondary_economy = message.SystemSecondEconomy
      } // Todo: Remove this once issue #177 is resolved

      // Disregard old messages but accept basic records created without an updated time
      if (!system.updated_at || system.updated_at < new Date(message.timestamp)) {
        // First handle aliasing of system name changes
        // Set an empty array for the system aliases if none exists
        if (!system.name_aliases) {
          system.name_aliases = []
        }

        let nameIsDifferent = false

        if (
          system.system_address === message.SystemAddress.toString() &&
          system.x === correctCoordinates(message.StarPos[0]) &&
          system.y === correctCoordinates(message.StarPos[1]) &&
          system.z === correctCoordinates(message.StarPos[2]) &&
          system.name !== message.StarSystem
        ) {
          // If the incoming system has the same address and location but the name is different
          // push the current name into the aliases list
          if (
            !system.name_aliases.find((alias) => alias.name === system.name && alias.name_lower === system.name_lower)
          ) {
            // Check if the alias already exists
            // Solves an edge case where cached data of the name before renaming comes in
            // Also can handle if a system is renamed back to its original name
            // Essentially it keeps the array unique
            system.name_aliases.push({
              name: system.name,
              name_lower: system.name_lower
            })
          }
          system.name = message.StarSystem
          system.name_lower = message.StarSystem.toLowerCase()
          nameIsDifferent = true
        }

        let historyObject = {}
        if (!system.eddb_id) {
          // Fetch the EDDB ID if not present already
          try {
            system.eddb_id = await getSystemEDDBIdByAddress(message.SystemAddress)
          } catch (err) {
            // Set the eddb id to null if any error occurs while fetching
            system.eddb_id = null
          }
        }
        // Check if the incoming details are the same as existing main record details
        if (
          system.government !== message.SystemGovernment.toLowerCase() ||
          system.allegiance !== message.SystemAllegiance.toLowerCase() ||
          system.state !== message.SystemFaction.FactionState.toLowerCase() ||
          system.security !== message.SystemSecurity.toLowerCase() ||
          system.population !== message.Population ||
          system.controlling_minor_faction !== message.SystemFaction.Name.toLowerCase() ||
          !system.conflicts ||
          nameIsDifferent ||
          !_.isEqual(
            _.sortBy(system.conflicts, ['faction1.name_lower']),
            _.sortBy(conflictsArray, ['faction1.name_lower'])
          ) ||
          !_.isEqual(_.sortBy(system.factions, ['name_lower']), _.sortBy(factionArray, ['name_lower']))
        ) {
          const timeNow = Date.now()
          // Get all history records which are less than 48 hours old
          const systemHistory = await HistorySystemModel.find({
            system_id: system._id,
            updated_at: {
              $lte: new Date(timeNow),
              $gte: new Date(timeNow - 172800000)
            }
          })
            .sort({ updated_at: -1 })
            .lean()
          // Check if the incoming details is the same as any record present in the last 2 days
          // This prevents caching issues
          if (checkSystemWHistory(message, systemHistory, factionArray, conflictsArray)) {
            system.government = message.SystemGovernment
            system.allegiance = message.SystemAllegiance
            system.state = message.SystemFaction.FactionState
            system.security = message.SystemSecurity
            system.population = message.Population
            system.controlling_minor_faction_cased = message.SystemFaction.Name
            system.controlling_minor_faction = message.SystemFaction.Name
            system.controlling_minor_faction_id = controllingFactionId
            system.factions = factionArray
            system.conflicts = conflictsArray
            system.updated_at = message.timestamp

            historyObject = {
              updated_at: message.timestamp,
              updated_by: 'EDDN',
              government: message.SystemGovernment,
              allegiance: message.SystemAllegiance,
              state: message.SystemFaction.FactionState,
              security: message.SystemSecurity,
              population: message.Population,
              controlling_minor_faction_cased: message.SystemFaction.Name,
              controlling_minor_faction: message.SystemFaction.Name,
              controlling_minor_faction_id: controllingFactionId,
              factions: factionArray,
              conflicts: conflictsArray,
              system_id: system._id,
              system_name: system.name,
              system_name_lower: system.name_lower
            }
          }
        } else {
          // Just update the time if the incoming data is the same as the last recorded data
          system.updated_at = message.timestamp
        }

        const systemRecord = await setSystemRecord(message.SystemAddress, system)
        if (!_.isEmpty(historyObject)) {
          // Update the history only when the object is not empty
          await setSystemHistory(historyObject)
        }
        return systemRecord
      }
    } else {
      throw new Error(
        'Invalid parameters for formAndSetSystemRecord: ' +
          JSON.stringify({
            message,
            system,
            factionArray,
            conflictsArray
          })
      )
    }
  }