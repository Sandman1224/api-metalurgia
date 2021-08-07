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

    return `${ machineCode }${ monthCode }-${ pieceNumber + 1 }`
}

module.exports = {
    getPieceCode
}