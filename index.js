const { color } = require('./utils')
const { create, Client } = require('@open-wa/wa-automate');
const fs = require('fs-extra')
const fss = require('fs')
const options = require('./utils/options')
const figlet = require('figlet')
const chalk = require('chalk');
const { log } = require('console');
const errorImgg = "https://i.ibb.co/jRCpLfn/user.png";
const setting = JSON.parse(fs.readFileSync("./settings/setting.json"));
let { ownerNumber, groupLimit, limitCount, memberLimit, prefix } = setting;



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
require('./lib');
nocache('./lib/menu.js', module => console.log(`'${module} updated!'`))
nocache('./lib', module => console.log(`'${module} updated!'`))
nocache(__filename , module => console.log(`'${module} updated!'`))


function start(client) {
  console.log('\x1Bc')
  console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
  console.log(color(figlet.textSync('Zaid Bot', { font: 'Ghost', horizontalLayout: 'default' })))
  console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
  console.log(color('[DEV]'), color('Zaid', 'green'))
  console.log(color('[~>>]'), color('BOT Started!', 'yellow'))

  client.sendText(ownerNumber, "Bot started!")
  // Mempertahankan sesi agar tetap nyala

  client.onStateChanged((state) => {
    console.log(color('[~>>]', 'red'), state)
    if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()

    
    if(state==='UNPAIRED') console.log('LOGGED OUT!!!!')
  })
 
  client.onMessage(async (message) => {
    try{
      client.getAmountOfLoadedMessages() // menghapus pesan cache jika sudah 3000 pesan.
              .then((msg) => {
                  if (msg >= 1000) {
                      console.log('[BOT]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                      client.cutMsgCache()
                  }
              })
      
      require('./message')(client, message , startTime)
    }catch(e){
      console.log(color("ERROR", "red"), e);
    }
  });

  client.onIncomingCall(async (callData) => {
    const banned = JSON.parse(fs.readFileSync("./settings/banned.json"));
    log(banned)
    const number = (callData.peerJid).replace(":60", "")
    // ketika seseorang menelpon nomor bot akan mengirim pesan
    await client.sendText(number, `Maaf sedang tidak bisa menerima panggilan.\nnelfon = block dan banned\nuntuk membuka silahkan chat owner wa.me/${ownerNumber.replace('@c.us','')} \n\n-bot`)
        
            // bot akan memblock nomor itu
    await client.contactBlock(number)
    banned.push(number)
    fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
       
  })

  

}


create(options(true, start))
.then(start)
.catch(err => {
  console.log(err);
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  // Clean up and exit
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  // Clean up and exit
  process.exit(0);
});
