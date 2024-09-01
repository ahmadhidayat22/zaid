/**
 * Get Client Options
 * @param  {Function} start function
 * @param  {Boolean} headless
 */

module.exports = options = (headless, start) => {
    const options = {
        sessionId: 'bot',
        headless: headless,
        logConsole: false,
        useChrome: true,
        autoRefresh:true,
        cacheEnabled:false,
        qrTimeout: 0,
        authTimeout: 0,
        restartOnCrash: start,
        executablePath : "/usr/bin/google-chrome-stable" //for linux server
        
    }
    return options
}
