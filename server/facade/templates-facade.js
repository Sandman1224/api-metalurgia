function queryBuilder(data) {
    const query = {}

    query.status = { $gt: -1 }

    if (data.type) {
        query.type = data.type
    }

    if (data.machine_id) {
        query.machine_id = data.machine_id
    }

    if (data.status) {
        query.status = data.status
    }

    if (data.created) {
        query.created = data.created
    }

    if (data.created_by) {
        query.created_by = data.created_by
    }

    return query
}

module.exports = {
    queryBuilder
}