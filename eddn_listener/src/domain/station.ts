this.setStationRecord = async (marketId, stationObject) => {
  return await StationModel.findOneAndUpdate(
    {
      market_id: marketId
    },
    stationObject,
    {
      upsert: true,
      runValidators: true,
      new: true
    }
  ).lean()
}

this.setStationHistory = async (historyObject) => {
  const document = new HistoryStationModel(historyObject)
  await document.save()
}

this.checkMessageDock = async (message, header) => {
    if (
      message.StarSystem &&
      message.MarketID &&
      message.timestamp &&
      message.StarPos &&
      message.event &&
      message.DistFromStarLS &&
      message.StationEconomy &&
      message.StationEconomies &&
      message.StationFaction &&
      typeof message.StationFaction !== 'string' &&
      !(message.StationFaction instanceof String) &&
      message.StationGovernment &&
      message.StationName &&
      message.StationServices &&
      message.StationType
    ) {
      if (message.StationType === 'FleetCarrier') {
        throw new Error('Message from Fleet Carrier')
      }
      if (message.StationType === 'MegaShip') {
        throw new Error('Message from Mega Ship')
      }
      if (
        nonBGSFactions.find((factionName) => {
          return factionName.toLowerCase() === message.StationFaction.Name.toLowerCase()
        })
      ) {
        throw new Error('Station owned by Non BGS Faction')
      }
      if (!message.StationFaction.FactionState) {
        message.StationFaction.FactionState = 'None'
      }
      if (!message.StationAllegiance) {
        message.StationAllegiance = 'Independent'
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
        const regexp = new RegExp(software.name, 'i')
        if (regexp.test(header.softwareName)) {
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

this.checkStationWHistory = (message, history, serviceArray) => {
    for (const item of history) {
      if (
        item.government === message.StationGovernment.toLowerCase() &&
        item.allegiance === message.StationAllegiance.toLowerCase() &&
        item.state === message.StationFaction.FactionState.toLowerCase() &&
        item.controlling_minor_faction === message.StationFaction.Name.toLowerCase() &&
        item.type === message.StationType.toLowerCase() &&
        _.isEqual(_.sortBy(item.services, ['name_lower']), _.sortBy(serviceArray, ['name_lower']))
      ) {
        return false
      }
    }
    return true
  }

this.getStationEDDBIdByMarketId = async (marketId) => {
    const url = 'https://eddbapi.kodeblox.com/api/v4/stations'
    const requestConfig: axios.AxiosRequestConfig = {
      url: url,
      params: {
        marketid: marketId
      }
    }
    const response = await axios.default.get(url, requestConfig)

    if (response.status === 200) {
      const responseObject = JSON.parse(response.data)
      if (responseObject.total > 0) {
        return responseObject.docs[0].id
      } else {
        throw new Error(response.statusText)
      }
    } else {
      throw new Error(response.statusText)
    }
  }

  this.formAndSetStationRecord = async (message, station, faction, serviceArray) => {
    // Check if all the parameters are valid
    if (message && station && faction && serviceArray) {
      // Sets the market_id and all_economies for stations that don't have them yet
      if (!station.market_id || !station.all_economies) {
        station.market_id = message.MarketID
        station.all_economies = message.StationEconomies.map((economy) => {
          return {
            name: economy.Name,
            proportion: economy.Proportion
          }
        })
      } // Todo: Remove this once issue #177 is resolved

      // Disregard old messages but accept basic records created without an updated time
      if (!station.updated_at || station.updated_at < new Date(message.timestamp)) {
        // First handle aliasing of system name changes
        // Set an empty array for the system aliases if none exists
        if (!station.name_aliases) {
          station.name_aliases = []
        }

        let nameIsDifferent = false

        if (
          station.market_id === message.MarketID &&
          station.system_lower === message.StarSystem.toLowerCase() &&
          station.name !== message.StationName
        ) {
          // If the incoming station has the same market id and system but the name is different
          // push the current name into the aliases list
          if (
            !station.name_aliases.find(
              (alias) => alias.name === station.name && alias.name_lower === station.name_lower
            )
          ) {
            // Check if the alias already exists
            // Solves an edge case where cached data of the name before renaming comes in
            // Also can handle if a station is renamed back to its original name
            // Essentially it keeps the array unique
            station.name_aliases.push({
              name: station.name,
              name_lower: station.name_lower
            })
          }
          station.name = message.StationName
          station.name_lower = message.StationName.toLowerCase()
          nameIsDifferent = true
        }

        let historyObject = {}
        if (!station.eddb_id) {
          // Fetch the EDDB ID if not present already
          try {
            station.eddb_id = await this.getStationEDDBIdByMarketId(message.MarketID)
          } catch (err) {
            // Set the eddb id to null if any error occurs while fetching
            station.eddb_id = null
          }
        }

        // Temporary fix
        if (!station.distance_from_star) {
          station.distance_from_star = message.DistFromStarLS
        }
        // Check if the incoming details are the same as existing main record details
        if (
          station.government !== message.StationGovernment.toLowerCase() ||
          station.allegiance !== message.StationAllegiance.toLowerCase() ||
          station.state !== message.StationFaction.FactionState.toLowerCase() ||
          station.controlling_minor_faction !== message.StationFaction.Name.toLowerCase() ||
          station.type !== message.StationType.toLowerCase() ||
          nameIsDifferent ||
          !_.isEqual(_.sortBy(station.services, ['name_lower']), _.sortBy(serviceArray, ['name_lower']))
        ) {
          const timeNow = Date.now()
          // Get all history records which are less than 48 hours old
          const stationHistory = await HistoryStationModel.find({
            station_id: station._id,
            updated_at: {
              $lte: new Date(timeNow),
              $gte: new Date(timeNow - 172800000)
            }
          })
            .sort({ updated_at: -1 })
            .lean()
          // Check if the incoming details is the same as any record present in the last 2 days
          // This prevents caching issues
          if (this.checkStationWHistory(message, stationHistory, serviceArray)) {
            station.government = message.StationGovernment
            station.allegiance = message.StationAllegiance
            station.state = message.StationFaction.FactionState
            station.type = message.StationType
            station.controlling_minor_faction_cased = message.StationFaction.Name
            station.controlling_minor_faction = message.StationFaction.Name
            station.controlling_minor_faction_id = faction._id
            station.services = serviceArray
            station.updated_at = message.timestamp

            historyObject = {
              updated_at: message.timestamp,
              updated_by: 'EDDN',
              type: message.StationType,
              government: message.StationGovernment,
              allegiance: message.StationAllegiance,
              state: message.StationFaction.FactionState,
              controlling_minor_faction_cased: message.StationFaction.Name,
              controlling_minor_faction: message.StationFaction.Name,
              controlling_minor_faction_id: faction._id,
              services: serviceArray,
              station_id: station._id,
              station_name: station.name,
              station_name_lower: station.name_lower
            }
          }
        } else {
          // Just update the time if the incoming data is the same as the last recorded data
          station.updated_at = message.timestamp
        }

        await this.setStationRecord(message.MarketID, station)
        if (!_.isEmpty(historyObject)) {
          // Update the history only when the object is not empty
          await this.setStationHistory(historyObject)
        }
      }
    } else {
      throw new Error(
        'Invalid parameters for formAndSetStationRecord: ' +
          JSON.stringify({
            message,
            station,
            faction,
            serviceArray
          })
      )
    }
}