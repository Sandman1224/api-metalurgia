function queryBuilder(data) {
    const query = {}

    if (!data.includeDeleted) {
        query.status = { $gt: -1 }
    }

    if (data.status) {
        query.status = data.status
    }

    if (data.type) {
        query.type = data.type
    }

    return query
}

module.exports = {
    queryBuilder
}