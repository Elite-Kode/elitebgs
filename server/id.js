/*
 * KodeBlox Copyright 2017 Sayak Mukhopadhyay
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

module.exports.governmentId = {
    "Anarchy": 16,
    "Communism": 32,
    "Confederacy": 48,
    "Corporate": 64,
    "Cooperative": 80,
    "Democracy": 96,
    "Dictatorship": 112,
    "Feudal": 128,
    "Imperial": 133,
    "Patronage": 144,
    "Prison Colony": 150,
    "Theocracy": 160,
    "Workshop": 165,
    "None": 176,
    "Engineer": 192
}

module.exports.allegianceId = {
    "Alliance": 1,
    "Empire": 2,
    "Federation": 3,
    "Independant": 4,
    "None": 5,
    "Pirate": 6
}

module.exports.stateId = {
    "Boom": 16,
    "Bust": 32,
    "Famine": 37,
    "Civil Unrest": 48,
    "Civil War": 64,
    "Election": 65,
    "Expansion": 67,
    "Lockdown": 69,
    "Outbreak": 72,
    "War": 73,
    "None": 80,
    "Retreat": 96,
    "Investment": 101
}

module.exports.economyIdsArray = [
    'Agriculture',
    'Colony',
    'Extraction',
    'High Tech',
    'Industrial',
    'Military',
    'None',
    'Refinery',
    'Service',
    'Terraforming',
    'Tourism'
]

module.exports.stateIdsArray = [
    'None',
    'Boom',
    'Bust',
    'Civil Unrest',
    'Civil War',
    'Election',
    'Expansion',
    'Famine',
    'Investment',
    'Lockdown',
    'Outbreak',
    'Retreat',
    'War'
]

module.exports.securityIdsArray = [
    'Anarchy',
    'Lawless',
    'High',
    'Low',
    'Medium'
]

module.exports.allegianceIdsArray = [
    'Alliance',
    'Empire',
    'Federation',
    'Independent',
    'None',
    'Pirate'
]

module.exports.governmentIdsArray = [
    'Anarchy',
    'Communism',
    'Confederacy',
    'Cooperative',
    'Corporate',
    'Democracy',
    'Dictatorship',
    'Feudal',
    'Imperial',
    'None',
    'Patronage',
    'Prison Colony',
    'Theocracy',
    'Workshop'
]

module.exports.economyFDevArray = [
    '$economy_agri;',
    '$economy_colony;',
    '$economy_extraction;',
    '$economy_hightech;',
    '$economy_industrial;',
    '$economy_military;',
    '$economy_none;',
    '$economy_refinery;',
    '$economy_service;',
    '$economy_terraforming;',
    '$economy_tourism;'
]

module.exports.stateFDevArray = [
    'none',
    'boom',
    'bust',
    'civilunrest',
    'civilwar',
    'election',
    'expansion',
    'famine',
    'investment',
    'lockdown',
    'outbreak',
    'retreat',
    'war'
]

module.exports.securityFDevArray = [
    '$galaxy_map_info_state_anarchy;',
    '$galaxy_map_info_state_lawless;',
    '$system_security_high;',
    '$system_security_low;',
    '$system_security_medium;'
]

module.exports.allegianceFDevArray = [
    'alliance',
    'empire',
    'federation',
    'independent',
    'none',
    '$pirate'
]

module.exports.governmentFDevArray = [
    '$government_anarchy;',
    '$government_communism;',
    '$government_confederacy;',
    '$government_cooperative;',
    '$government_corporate;',
    '$government_democracy;',
    '$government_dictatorship;',
    '$government_feudal;',
    '$government_imperial;',
    '$government_none;',
    '$government_patronage;',
    '$government_prisoncolony;',
    '$government_theocracy;',
    '$government_engineer;'
]
