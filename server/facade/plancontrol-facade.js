function queryBuilder(data) {
    const query = {}

    query.status = { $gt: -1 }
    if (data.status) {
        query.status = data.status
    }

    if (data.piece_number) {
        query.piece_number = { $regex: new RegExp(`${data.piece_number}`), $options: 'i' }
    }

    if (data.type_template) {
        query.type_template = data.type_template
    }

    return query
}

module.exports = {
    queryBuilder
}