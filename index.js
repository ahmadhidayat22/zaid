const { color } = require('./utils')
const { create, Client } = require('@open-wa/wa-automate');
const fs = require('fs-extra')
const fss = require('fs')
const options = require('./utils/options')
const figlet = require('figlet')
const chalk = require('chalk');
const { log } = require('console');



/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
const nocache = (module, call = () => { }) => {
  console.log(color('[WATCH]', 'orange'), color(`=> '${module}'`, 'yellow'), 'file is now being watched by me!')
  fs.watchFile(require.resolve(module), async () => {
      await uncache(require.resolve(module))
      call(module)
  })
}



/**
 * Uncache a module
 * @param {string} module Module name or path
 */
const uncache = (module = '.') => {
  return new Promise((resolve, reject) => {
      try {
          delete require.cache[require.resolve(module)]
          resolve()
      } catch (err) {
          reject(err)
      }
  })
}

const startTime = Date.now()

require('./message')
nocache('./message', module => console.log(`'${module} updated!'`))
require('./lib/menu.js')
nocache('./lib/menu.js', module => console.log(`'${module} updated!'`))
nocache(__filename, module => console.log(`'${module}' Updated!`))

function start(client) {
  console.log('\x1Bc')

  console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
  console.log(color(figlet.textSync('Zaid Bot', { font: 'Ghost', horizontalLayout: 'default' })))
  console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
  console.log(color('[DEV]'), color('Zaid', 'green'))
  console.log(color('[~>>]'), color('BOT Started!', 'yellow'))

  // Mempertahankan sesi agar tetap nyala

  client.onStateChanged((state) => {
    console.log(color('[~>>]', 'red'), state)
    if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
  })

  client.onMessage(async (message) => {
    client.getAmountOfLoadedMessages() // menghapus pesan cache jika sudah 3000 pesan.
            .then((msg) => {
                if (msg >= 3000) {
                    console.log('[BOT]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                    client.cutMsgCache()
                }
            })
    require('./message')(client, message , startTime)
  });

}

create(options(true, start))
.then(start)
.catch(err => {
  console.log(err);
})

