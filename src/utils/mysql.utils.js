function createPlaceholderString(count) {
    // '?, ?, ' remove last 2 characters (', ')
    // will return '?, ?'
    return '?, '.repeat(count).slice(0, -2);
}


module.exports = {
    createPlaceholderString,
};