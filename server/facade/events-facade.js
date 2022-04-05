const ObjectId = require('mongoose').Types.ObjectId

function queryBuilder(data) {
    const query = {}

    if (data.templateId) {
        query.templateId = new ObjectId(data.templateId)
    }

    return query
}

module.exports = {
    queryBuilder
}