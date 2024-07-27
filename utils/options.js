/**
 * Get Client Options
 * @param  {Function} start function
 * @param  {Boolean} headless
 */

module.exports = options = (headless, start) => {
    const options = {
        sessionId: 'bot',
        headless: headless,
        useChrome: true,
        autoRefresh:true,
        cacheEnabled:false,
        qrTimeout: 0,
        authTimeout: 0,
        restartOnCrash: start,
        cacheEnabled: false,
        
    }
    return options
}
