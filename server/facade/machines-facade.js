function queryBuilder(data) {
    const query = {}

    query.status = { $gt: -1 }

    if (data.deviceIp) {
        query.devices = data.deviceIp
    }

    return query
}

module.exports = {
    queryBuilder
}