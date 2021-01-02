const { format } = require("date-fns");
const { da } = require("date-fns/locale");

function createPlaceholderString(count) {
    // '?, ?, ' remove last 2 characters (', ')
    // will return '?, ?'
    return '?, '.repeat(count).slice(0, -2);
}

function toMysqlTimestampString(date) {
    if (!date instanceof Date) {
        throw new Error("cannot convert non Date object to Mysql timestamp");
    }
    return format(date, 'YYYY-MM-DD HH:MM:SS')
}

module.exports = {
    createPlaceholderString,
};