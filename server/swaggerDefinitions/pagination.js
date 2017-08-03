module.exports = function (documentRef) {
    return {
        docs: {
            type: 'array',
            items: {
                $ref: `#/definitions/${documentRef}`
            }
        },
        total: { type: "integer" },
        limit: { type: "integer" },
        page: { type: "integer" },
        pages: { type: "integer" }
    }
}
