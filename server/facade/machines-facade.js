const ObjectId = require('mongoose').Types.ObjectId

function queryBuilder(data) {
    const query = {}

    query.status = { $gt: -1 }

    if (data.deviceIp) {
        query.devices = data.deviceIp
    }

    if (data.ids) {
        const listIds = data.ids.map((id) => new ObjectId(id))
        query._id = { $in: listIds }
    }

    return query
}

module.exports = {
    queryBuilder
}