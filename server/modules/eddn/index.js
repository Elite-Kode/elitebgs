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

const zlib = require('zlib');
const zmq = require('zmq');
const ajv = require('ajv');
const schemas = require('./schemas');
const travel = require('./travel');

const sock = zmq.socket('sub');

sock.connect('tcp://eddn-relay.elite-markets.net:9500');
console.log('Worker connected to port 9500');

sock.subscribe('');

sock.on('message', topic => {
    let message = JSON.parse(zlib.inflateSync(topic));

    let messageHeader = message.header;
    let messageSchema = message.$schemaRef;
    let messageBody = message.message;
    // console.log("Header ------");
    // console.log(messageHeader);
    // console.log("Schema ------");
    // console.log(messageSchema);
    // console.log("Body --------");
    // console.log(messageBody);

    let ajvObj = (() => {
        let metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');

        let ajvRet = new ajv({ meta: false });
        ajvRet.addMetaSchema(metaSchema);
        ajvRet._opts.defaultMeta = metaSchema.id;
        ajvRet._refs['http://json-schema.org/schema'] = 'http://json-schema.org/draft-04/schema';
        ajvRet.removeKeyword('propertyNames');
        ajvRet.removeKeyword('contains');
        ajvRet.removeKeyword('const');

        return ajvRet;
    })();

    if (ajvObj.validate(schemas.journalV1, message)) {
        if (messageBody.event === "FSDJump") {
            travel.fsdjump(messageBody);
        }
    }
});