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
