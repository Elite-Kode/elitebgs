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

module.exports = {
    _id: { type: "string" },
    __v: { type: "integer" },
    updated_at: { type: "string" },
    updated_by: { type: "string" },
    faction_name: { type: "string" },
    faction_name_lower: { type: "string" },
    faction_id: { type: "string" },
    state: { type: "string" },
    influence: { type: "integer" },
    happiness: { type: "string" },
    active_states: {
        type: "array",
        items: {
            $ref: '#/definitions/EBGSStateActiveV5'
        }
    },
    pending_states: {
        type: 'array',
        items: {
            $ref: '#/definitions/EBGSStateV5'
        }
    },
    recovering_states: {
        type: 'array',
        items: {
            $ref: '#/definitions/EBGSStateV5'
        }
    },
    conflicts: {
        type: 'array',
        items: {
            $ref: '#/definitions/EBGSConflictFactionV5'
        }
    },
    systems:{
        type:'array',
        items:{
            $ref:'#/definitions/EBGSSystemRefV5'
        }
    }
}
