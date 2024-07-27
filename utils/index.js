const chalk = require('chalk')
const moment = require('moment-timezone')

moment.tz.setDefault('Asia/Jakarta').locale('id')


/**
 * Get text with color
 * @param  {String} text
 * @param  {String} color
 * @return  {String} Return text with color
 */
const color = (text, color) => {
    return !color ? chalk.blueBright(text) : chalk.keyword(color)(text)
}


/**
 * Get Time duration
 * @param  {Date} timestamp
 * @param  {Date} now
 */
const processTime = (timestamp, now) => {
    // timestamp => timestamp when message was received
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}



module.exports = {
    processTime,
    color
}