function getPieceCode(machineCode, currentMonth, pieceNumber) {
    let monthCode = ''
    switch (currentMonth) {
        case '0':
            monthCode = 'A'
            break
        case '1':
            monthCode = 'B'
            break
        case '2':
            monthCode = 'C'
            break
        case '3':
            monthCode = 'D'
            break
        case '4':
            monthCode = 'E'
            break
        case '5':
            monthCode = 'H'
            break
        case '6':
            monthCode = 'I'
            break
        case '7':
            monthCode = 'K'
            break
        case '8':
            monthCode = 'L'
            break
        case '9':
            monthCode = 'M'
            break
        case '10':
            monthCode = 'N'
            break
        case '11':
            monthCode = 'O'
            break
    }

    const formattedNumber = zeroFill(pieceNumber + 1, 4)
    return `${ machineCode }${ monthCode }-${ formattedNumber }`
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

    if (data.template_id) {
        query.template_id = data.template_id
    }

    return query
}

module.exports = {
    getPieceCode,
    queryBuilder
}