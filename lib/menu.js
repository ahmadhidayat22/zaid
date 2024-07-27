const fs = require('fs-extra')
const {prefix} = JSON.parse(fs.readFileSync('./settings/setting.json'))


exports.textMenu = (pushname, runtime) => {
    return `

    ◪ 𝗜𝗡𝗙𝗢
    ❏ user : ${pushname}
    ❏ Versi : 2.0.0
    ❏ Liberary : whiskeysocket
    ❏ Prefix: 「  ${prefix}  」
    ❏ Runtime : ${runtime}
    ❏ Server : Debian GNU/Linux 12 

    ◪ 𝗦𝗬𝗦𝗧𝗘𝗠
    │
    ├─ ❏ bcgrup
    ├─ ❏ bcimg
    │
    │
    └─ ❏ ping

    ◪ TOOLS
    │
    ├─ ❏ artinama
    ├─ ❏ cekkhodam
    ├─ ❏ spotifysearch
    ├─ ❏ pantun
    ├─ ❏ fakta
    └─

    ◪ EDUKASI + TOBAT
    │
    ├─ ❏ Alaudio
    ├─ ❏ tafsir
    ├─ ❏ surah
    ├─ ❏ infosurah
    ├─ ❏ wiki


    ◪ GAME
    │
    ├─

    ◪ 𝗚𝗥𝗢𝗨𝗣
    │
    ├─ ❏ promote
    ├─ ❏ demote
    ├─ ❏ add
    ├─ ❏ kick
    ├─ ❏ del
    └─ ❏ tagall


`
}


exports.menuUmum = () => {
    return `

    
    
`
}



