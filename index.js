const { create, Client } = require('@open-wa/wa-automate');
// or
// import { create, Client } from '@open-wa/wa-automate';

const launchConfig = {
    useChrome: true,
    autoRefresh:true,
    cacheEnabled:false,
    sessionId: 'bot'
};


function start(client) {
  client.onMessage(async message => {
    console.log(message)
    if (message.body === 'hi') {
      await client.sendText(message.from, '👋 Hello!');
    }
  });
}

create(launchConfig).then(start);