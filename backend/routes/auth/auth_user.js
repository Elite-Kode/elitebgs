/*
 * KodeBlox Copyright 2021 Sayak Mukhopadhyay
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

"use strict";

const express = require('express');

let bannedAccess = 'BANNED'
let normalAccess = 'NORMAL'
let adminAccess = 'ADMIN'

let router = express.Router();

router.get('/', (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.send({});
    }
});

router.post('/monitor/factions', async (req, res, next) => {
  if (req.user) {
    try {
      let users = require('../../models/ebgs_users')
      let user = req.user
      let newFactions = []
      await Promise.all(arrayfy(req.body.factions).filter(faction => {
        return user.factions.findIndex(element => {
          return element.id.toString() === faction
        }) === -1
      }).map(async faction => {
        let model = require('../../models/ebgs_factions_v5')
        let factionGot = await model.findOne({
          _id: faction
        }).lean()
        if (factionGot) {
          newFactions.push({
            id: factionGot._id,
            name: factionGot.name,
            name_lower: factionGot.name_lower
          })
        } else {
          throw new Error('Faction not present')
        }
      }))
      await users.findOneAndUpdate({
          _id: req.user._id
        },
        {
          $addToSet: {
            factions: {
              $each: newFactions
            }
          }
        },
        {
          upsert: false,
          runValidators: true
        })
      res.send(true)
    } catch (err) {
      console.log(err)
      res.send(false)
      next(err)
    }
  }
})

router.post('/monitor/systems', async (req, res, next) => {
  if (req.user) {
    try {
      let users = require('../../models/ebgs_users')
      let user = req.user
      let newSystems = []
      await Promise.all(arrayfy(req.body.systems).filter(system => {
        return user.systems.findIndex(element => {
          return element.id.toString() === system
        }) === -1
      }).map(async system => {
        let model = require('../../models/ebgs_systems_v5')
        let systemGot = await model.findOne({
          _id: system
        }).lean()
        if (systemGot) {
          newSystems.push({
            id: systemGot._id,
            name: systemGot.name,
            name_lower: systemGot.name_lower
          })
        } else {
          throw new Error('System not present')
        }
      }))
      await users.findOneAndUpdate({
          _id: req.user._id
        },
        {
          $addToSet: {
            systems: {
              $each: newSystems
            }
          }
        },
        {
          upsert: false,
          runValidators: true
        })
      res.send(true)
    } catch (err) {
      console.log(err)
      res.send(false)
      next(err)
    }
  }
})

router.delete('/monitor/factions', async (req, res, next) => {
  if (req.user) {
    try {
      let users = require('../../models/ebgs_users')
      if (req.query.faction) {
        await users.findOneAndUpdate({
            _id: req.user._id
          },
          {
            $pull: {
              factions: {
                id: req.query.faction
              }
            }
          },
          {
            upsert: false,
            runValidators: true
          })
      }
      res.send(true)
    } catch (err) {
      console.log(err)
      res.send(false)
      next(err)
    }
  }
})

router.delete('/monitor/systems', async (req, res, next) => {
  if (req.user) {
    try {
      let users = require('../../models/ebgs_users')
      if (req.query.system) {
        await users.findOneAndUpdate({
            _id: req.user._id
          },
          {
            $pull: {
              systems: {
                id: req.query.system
              }
            }
          },
          {
            upsert: false,
            runValidators: true
          })
      }
      res.send(true)
    } catch (err) {
      console.log(err)
      res.send(false)
      next(err)
    }
  }
})

router.delete('/delete', async (req, res, next) => {
    if (req.user && (req.user._id === req.query.userid || req.user.access === adminAccess)) {
        try {
            let users = require('../../models/ebgs_users');
            await users.findByIdAndRemove(req.query.userid)
            res.send(true);
        } catch (err) {
            console.log(err);
            res.send(false);
            next(err);
        }
    }
});

let arrayfy = requestParam => {
    let regex = /\s*,\s*/;
    let mainArray = requestParam.split(regex);

    mainArray.forEach((element, index, allElements) => {
        allElements[index] = element;
    });

    return mainArray;
}

module.exports = router;
