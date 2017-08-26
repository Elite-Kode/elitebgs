module.exports = {
    updated_at: { type: "string" },
    population: { type: "integer" },
    government: { type: "string" },
    allegiance: { type: "string" },
    state: { type: "string" },
    security: { type: "string" },
    controlling_minor_faction: { type: "string" },
    factions: {
        type: 'array',
        items: {
            $ref: '#/definitions/EBGSSystemPresenceV3'
        }
    }
}
