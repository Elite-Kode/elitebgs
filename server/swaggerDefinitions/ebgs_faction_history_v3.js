module.exports = {
    updated_at: { type: "string" },
    system: { type: "string" },
    system_lower: { type: "string" },
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
    },
    systems:{
        type:'array',
        items:{
            $ref:'#/definitions/EBGSSystemPresenceV3'
        }
    }
}
