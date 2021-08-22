this.checkFactionWHistory = (
    message,
    messageFaction,
    history,
    activeStates,
    pendingStates,
    recoveringStates,
    conflicts
  ) => {
    for (const item of history) {
      if (
        item.system_lower === message.StarSystem.toLowerCase() &&
        item.state === messageFaction.FactionState.toLowerCase() &&
        item.influence === messageFaction.Influence &&
        item.happiness === messageFaction.Happiness.toLowerCase() &&
        item.conflicts &&
        _.isEqual(_.sortBy(item.conflicts, ['opponent_name_lower']), _.sortBy(conflicts, ['opponent_name_lower'])) &&
        _.isEqual(_.sortBy(item.active_states, ['state']), _.sortBy(activeStates, ['state'])) &&
        _.isEqual(_.sortBy(item.pending_states, ['state']), _.sortBy(pendingStates, ['state'])) &&
        _.isEqual(_.sortBy(item.recovering_states, ['state']), _.sortBy(recoveringStates, ['state']))
      ) {
        return false
      }
    }
    return true
  }

this.setFactionRecord = async (nameLower, factionObject) => {
    return await FactionModel.findOneAndUpdate(
      {
        name_lower: nameLower
      },
      factionObject,
      {
        upsert: true,
        runValidators: true,
        new: true
      }
    ).lean()
  }

  this.doFactionUpdate = async (messageFaction, dbFaction, message, factions, stations, system) => {
    // Set the happiness value to "none" if there is no happiness field or if the happiness string is empty
    let happiness = ''
    if (!messageFaction.Happiness || messageFaction.Happiness.length === 0) {
      happiness = 'none'
    } else {
      happiness = messageFaction.Happiness.toLowerCase()
    }
    // Form the states arrays
    let activeStates = []
    if (messageFaction.ActiveStates) {
      activeStates = messageFaction.ActiveStates.map((activeState) => {
        return {
          state: activeState.State.toLowerCase()
        }
      })
    }
    let pendingStates = []
    if (messageFaction.PendingStates) {
      pendingStates = messageFaction.PendingStates.map((pendingState) => {
        return {
          state: pendingState.State.toLowerCase(),
          trend: pendingState.Trend
        }
      })
    }
    let recoveringStates = []
    if (messageFaction.RecoveringStates) {
      recoveringStates = messageFaction.RecoveringStates.map((recoveringState) => {
        return {
          state: recoveringState.State.toLowerCase(),
          trend: recoveringState.Trend
        }
      })
    }
    const factionName = dbFaction.name_lower
    // Form the conflicts array
    let conflicts = []
    if (message.Conflicts) {
      // First filter out the conflicts in this system that doesn't have this faction as a participant
      conflicts = message.Conflicts.filter((conflict) => {
        return (
          conflict.Faction1.Name.toLowerCase() === factionName || conflict.Faction2.Name.toLowerCase() === factionName
        )
      }).map((conflict) => {
        let opponent
        let stake
        let daysWon
        if (conflict.Faction1.Name.toLowerCase() === factionName) {
          opponent = conflict.Faction2.Name
          stake = conflict.Faction1.Stake
          daysWon = +conflict.Faction1.WonDays
        } else {
          opponent = conflict.Faction1.Name
          stake = conflict.Faction2.Stake
          daysWon = +conflict.Faction2.WonDays
        }
        const opponentId = factions.find((faction) => faction.name_lower === opponent.toLowerCase())._id
        const station = stations.find((station) => station.name_lower === stake.toLowerCase())
        let stationId = null
        // An explicit check is needed since the station at stake might not be in the database
        // This could be because nobody has sent sent data yet or it is a non dockable base
        if (station) {
          stationId = station._id
        }
        return {
          type: conflict.WarType,
          status: conflict.Status,
          opponent_name: opponent,
          opponent_name_lower: opponent.toLowerCase(),
          opponent_faction_id: opponentId,
          station_id: stationId,
          stake: stake,
          stake_lower: stake.toLowerCase(),
          days_won: daysWon
        }
      })
    }

    // Check if the incoming message has any different faction detail
    let doUpdate = true
    let doUpdateTime = true
    // If the faction record itself has a newer time (and it exists - so not a basic record)
    // that means this record was updates by a newer message from some other system
    // So make sure not to update the main record time
    if (dbFaction.updated_at && dbFaction.updated_at > new Date(message.timestamp)) {
      doUpdateTime = false
    }

    // Get the faction presence element that needs to be updated
    const factionPresenceElement = dbFaction.faction_presence.find((presence) => {
      return presence.system_name_lower === message.StarSystem.toLowerCase()
    })

    if (
      factionPresenceElement &&
      factionPresenceElement.state === messageFaction.FactionState.toLowerCase() &&
      factionPresenceElement.influence === messageFaction.Influence &&
      factionPresenceElement.happiness === messageFaction.Happiness.toLowerCase() &&
      factionPresenceElement.conflicts &&
      _.isEqual(
        _.sortBy(factionPresenceElement.conflicts, ['opponent_name_lower']),
        _.sortBy(conflicts, ['opponent_name_lower'])
      ) &&
      _.isEqual(_.sortBy(factionPresenceElement.active_states, ['state']), _.sortBy(activeStates, ['state'])) &&
      _.isEqual(_.sortBy(factionPresenceElement.pending_states, ['state']), _.sortBy(pendingStates, ['state'])) &&
      _.isEqual(_.sortBy(factionPresenceElement.recovering_states, ['state']), _.sortBy(recoveringStates, ['state']))
    ) {
      // The presence data in the master record is the same as the incoming message so dont update
      doUpdate = false
    } else {
      const timeNow = Date.now()
      const factionHistory = await HistoryFactionModel.find({
        faction_id: dbFaction._id,
        system_id: system._id,
        updated_at: {
          $lte: new Date(timeNow),
          $gte: new Date(timeNow - 172800000) // Get the faction history for the last 48 hours
        }
      })
        .sort({ updated_at: -1 })
        .lean()
      // Check if the incoming details is the same as any record present in the last 2 days
      // This prevents caching issues
      if (
        !this.checkFactionWHistory(
          message,
          messageFaction,
          factionHistory,
          activeStates,
          pendingStates,
          recoveringStates,
          conflicts
        )
      ) {
        doUpdate = false
        doUpdateTime = false
      }
    }

    // doUpdate indicate if the new record should be added into the history and the master record data updated
    // doUpdateTime indicate if the master record's update time should be updated
    return { activeStates, pendingStates, recoveringStates, conflicts, happiness, doUpdate, doUpdateTime }
  }

  // TODO: Add delta calculation to this code
  this.setFactionHistory = async (historyObject) => {
    // TODO: Find the previous history document for this {faction, system}

    // let delta = diff lastRecord.updated_at historyObject.updated_at
    // store delta in historyObject let historyObject.delta = delta

    const document = new HistoryFactionModel(historyObject)
    await document.save()
  }

  this.getFactionEDDBId = async (name) => {
    const url = 'https://eddbapi.kodeblox.com/api/v4/factions'
    const requestConfig: axios.AxiosRequestConfig = {
      url: url,
      params: {
        name: name.toLowerCase()
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

  this.formAndSetFactionRecord = async (message, factions, stations, system) => {
    // Check if all the parameters are valid
    if (message && system && factions.length > 0 && stations) {
      // Get all factions from the db which has the current system as a presence system
      const allFactionsPresentInSystemDB = await FactionModel.find({
        faction_presence: {
          $elemMatch: { system_id: system._id }
        }
      }).lean()

      // Get the difference between the factions present initially vs in the message
      // These factions needs to be removed
      const toRemove = _.differenceWith(allFactionsPresentInSystemDB, factions, (existingInDB, fetchedByMessages) => {
        return existingInDB.name_lower === fetchedByMessages.name_lower
      })

      // To remove are those factions which are not present in this system anymore
      // Such factions need to be updated too
      // Todo: This doesnt take into consideration old and cached records
      for (const factionObject of toRemove) {
        // Filtering out the current system from the faction presence list of this faction
        factionObject.faction_presence = factionObject.faction_presence.filter(
          (system) => system.system_name_lower !== message.StarSystem.toLowerCase()
        )
        factionObject.updated_at = message.timestamp

        if (!factionObject.eddb_id) {
          try {
            factionObject.eddb_id = await this.getFactionEDDBId(factionObject.name)
          } catch (err) {
            // Set the eddb id to null if any error occurs while fetching
            factionObject.eddb_id = null
          }
        }
        // Do the actual db operations
        await this.setFactionRecord(factionObject.name_lower, factionObject)
      }

      // All factions are already created, either earlier or in their basic form above so we need to update them
      for (const factionObject of factions) {
        // The faction_presence can be null if created as basic
        if (!factionObject.faction_presence) {
          factionObject.faction_presence = []
        }
        // Get the last updated time of this presence record
        let factionPresenceUpdatedAt = _.get(
          factionObject.faction_presence.find((presence) => {
            return presence.system_id.equals(system._id)
          }),
          'updated_at',
          null
        )

        const messageFaction = message.Factions.find((faction) => {
          return faction.Name.toLowerCase() === factionObject.name_lower
        })

        // If the faction presence doesn't have the updated_at record, get from the factionObject itself
        if (!factionPresenceUpdatedAt) {
          factionPresenceUpdatedAt = factionObject.updated_at
        }
        if (!factionPresenceUpdatedAt || factionPresenceUpdatedAt < new Date(message.timestamp)) {
          // Ignore old records but accept if the updated at is null since it might be so for a basic record
          // Decide whether to update the faction record or not
          // Also decide whether to update the main time or not
          const getDoFactionUpdate = await this.doFactionUpdate(
            messageFaction,
            factionObject,
            message,
            factions,
            stations,
            system
          )
          const activeStates = getDoFactionUpdate.activeStates
          const pendingStates = getDoFactionUpdate.pendingStates
          const recoveringStates = getDoFactionUpdate.recoveringStates
          const conflicts = getDoFactionUpdate.conflicts
          const happiness = getDoFactionUpdate.happiness
          const doUpdate = getDoFactionUpdate.doUpdate
          const doUpdateTime = getDoFactionUpdate.doUpdateTime
          let factionPresence = []
          if (doUpdate || doUpdateTime) {
            // If doUpdateTime is set to false set the updated at time
            let factionPresentSystemObject = {}
            factionPresence = factionObject.faction_presence

            // Faction presence can be null when a basic record is created
            if (!factionPresence) {
              factionPresence = []
            }

            factionPresence.forEach((factionPresenceObject, index, factionPresenceArray) => {
              if (factionPresenceObject.system_id.equals(system._id)) {
                // Iterates over all existing faction presences to create a new faction presence object for the current faction
                // This new object is then reapplied over the existing array element to update it
                factionPresentSystemObject = {
                  system_name: message.StarSystem,
                  system_name_lower: message.StarSystem.toLowerCase(),
                  system_id: system._id,
                  state: messageFaction.FactionState,
                  influence: messageFaction.Influence,
                  happiness: happiness,
                  active_states: activeStates,
                  pending_states: pendingStates,
                  recovering_states: recoveringStates,
                  conflicts: conflicts,
                  updated_at: message.timestamp
                }
                factionPresenceArray[index] = factionPresentSystemObject
              }
            })

            // Check if a new faction presence object was initialised or not
            if (_.isEmpty(factionPresentSystemObject)) {
              // This system is not present as a presence system in db.
              // Make a new array element
              factionPresence.push({
                system_name: message.StarSystem,
                system_name_lower: message.StarSystem.toLowerCase(),
                system_id: system._id,
                state: messageFaction.FactionState,
                influence: messageFaction.Influence,
                happiness: happiness,
                active_states: activeStates,
                pending_states: pendingStates,
                recovering_states: recoveringStates,
                conflicts: conflicts,
                updated_at: message.timestamp
              })
            }

            // Update the faction presence and time
            factionObject.updated_at = message.timestamp
            factionObject.faction_presence = factionPresence
            // Get and set the eddb id if not present
            if (!factionObject.eddb_id) {
              try {
                factionObject.eddb_id = await this.getFactionEDDBId(messageFaction.Name)
              } catch (err) {
                factionObject.eddb_id = null
              }
            }
            // Do the actual db operation
            await this.setFactionRecord(factionObject.name_lower, factionObject)
          }
          if (doUpdate) {
            // Create the faction history element for storing current systems
            const systemHistory = factionPresence.map((faction) => {
              return {
                system_id: system._id,
                name: faction.system_name,
                name_lower: faction.system_name_lower
              }
            })

            // Obtain the delta in seconds between the message timestamp
            // let delta = await this.getFactionHistoryDelta(systemHistory, message.timestamp, messageFaction.Influence)

            const historyObject = {
              updated_at: message.timestamp,
              updated_by: 'EDDN',
              system: message.StarSystem,
              system_lower: message.StarSystem.toLowerCase(),
              system_id: system._id,
              faction_id: factionObject._id,
              faction_name: factionObject.name,
              faction_name_lower: factionObject.name_lower,
              state: messageFaction.FactionState,
              influence: messageFaction.Influence,
              happiness: happiness,
              active_states: activeStates,
              pending_states: pendingStates,
              recovering_states: recoveringStates,
              conflicts: conflicts,
              systems: systemHistory
            }

            // Do the db operation for history
            await this.setFactionHistory(historyObject)
          }
        }
      }
    } else {
      throw new Error(
        'Invalid parameters for formAndSetFactionRecord: ' +
          JSON.stringify({
            message,
            factions,
            stations,
            system
          })
      )
    }
  }