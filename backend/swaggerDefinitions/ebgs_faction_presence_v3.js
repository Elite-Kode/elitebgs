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
    system_name: { type: "string" },
    system_name_lower: { type: "string" },
    state: { type: "string" },
    influence: { type: "integer" },
    pending_states: {
        type: 'array',
        items: {
            $ref: '#/definitions/EBGSStateV3'
        }
    },
    recovering_states: {
        type: 'array',
        items: {
            $ref: '#/definitions/EBGSStateV3'
        }
    }
}
