module.exports = {
    updated_at: { type: "string" },
    system: { type: "string" },
    system_lower: { type: "string" },
    state: { type: "string" },
    influence: { type: "integer" },
    pending_states: {
        type: 'array',
        items: {
            $ref: '#/definitions/EBGSState'
        }
    },
    recovering_states: {
        type: 'array',
        items: {
            $ref: '#/definitions/EBGSState'
        }
    }
}
