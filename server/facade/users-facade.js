function queryBuilder(data) {
    const query = {}

    query.status = { $gt: -1 }

    if (data.ids) {
        const listIds = data.ids.map((id) => new ObjectId(id))
        query._id = { $in: listIds }
    }

    if (data.idsEmployees) {
        query.employeeId = { $in: data.idsEmployees }
    }

    return query
}

module.exports = {
    queryBuilder
}