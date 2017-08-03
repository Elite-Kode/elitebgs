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

module.exports = {
    _id: { type: "string" },
    __v: { type: "integer" },
    id: { type: "integer" },
    station_id: { type: "integer" },
    commodity_id: { type: "integer" },
    supply: { type: "integer" },
    buy_price: { type: "integer" },
    sell_price: { type: "integer" },
    demand: { type: "integer" },
    collected_at: { type: "string" },
}
