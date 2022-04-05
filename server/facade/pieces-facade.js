const pieceModel = require('../models/pieces')

function getMonthCode(currentMonth) {
    let monthCode = ''
    switch (currentMonth) {
        case '1':
            monthCode = 'A'
            break
        case '2':
            monthCode = 'B'
            break
        case '3':
            monthCode = 'C'
            break
        case '4':
            monthCode = 'D'
            break
        case '5':
            monthCode = 'E'
            break
        case '6':
            monthCode = 'H'
            break
        case '7':
            monthCode = 'I'
            break
        case '8':
            monthCode = 'K'
            break
        case '9':
            monthCode = 'L'
            break
        case '10':
            monthCode = 'M'
            break
        case '11':
            monthCode = 'N'
            break
        case '12':
            monthCode = 'O'
            break
    }

    return monthCode
}

function getPieceCode(machineCode, currentMonth, pieceNumber) {
    const monthCode = getMonthCode(currentMonth)

    const formattedNumber = zeroFill(pieceNumber + 1, 4)
    return `${ machineCode }${ monthCode }-${ formattedNumber }`
}

function getLastPieceCode(machineId, currentYear, currentMonth) {
    const queryParams = { machineId, currentYear, currentMonth }
    const queryBody = queryBuilder(queryParams)

    try {
        return pieceModel.countDocuments(queryBody).exec()
    } catch (error) {
        return { ok: false, identificator: 'error-db' }
    }
}

function zeroFill(number, width)
{
  width -= number.toString().length;
  if ( width > 0 ){
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }

  return number + "";
}

function queryBuilder(data) {
    const query = {}

    query.status = { $gt: -1 }
    if (data.status) {
        query.status = data.status
    }

    if (data.piece_number) {
        query.piece_number = { $regex: new RegExp(`${data.piece_number}`), $options: 'i' }
    }

    if (data.machineId) {
        query.machine_id = data.machineId
    }

    if (data.template_id) {
        query.template_id = data.template_id
    }

    if (data.currentYear) {
        query.currentYear = data.currentYear
    }

    if (data.currentMonth) {
        query.currentMonth = data.currentMonth
    }

    return query
}

module.exports = {
    getPieceCode,
    getMonthCode,
    getLastPieceCode,
    zeroFill,
    queryBuilder
}