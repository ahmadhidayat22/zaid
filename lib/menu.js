const fs = require('fs-extra')
const {prefix} = JSON.parse(fs.readFileSync('./settings/setting.json'))

exports.listMenu = () => {
    return`
╔══✪〘 All Menu 〙✪══
╠➥ menuadmin
╠➥ menuowner
╠➥ menugroup
╠➥ menupenting
╚════════
`
}


exports.menupenting = () => {
    return`
List Menu Utama:

🚀 *${prefix}bard* atau *${prefix}b*
Tanyakan apa saja kepada BARD AI.
Usage: ketik *${prefix}bard* siapa itu jokowi 

🚀 *${prefix}gpt*
Tanyakan apa saja kepada AI. {versi gpt 5} 
Usage: ketik *${prefix}gpt* siapa itu jokowi 

🚀 *${prefix}stiker*
buat stiker dari gambar.
Usage : upload gambar kemudian ketik *${prefix}stiker*

🚀 *${prefix}tkmp4* 
Mendownload vidio dari tiktok.
Usage : ketik *${prefix}tkmp4*

🚀 *${prefix}ig* 
Mendownload vidio/gambar dari instagram (reels/IGTV/Post).
Usage : ketik *${prefix}ig*

🚀 *${prefix}igs* 
Mendownload vidio/gambar dari story instagram.
Usage : ketik *${prefix}igs*

🚀 *${prefix}ytmp4* 
Mendownload vidio dari youtube.
Usage : ketik *${prefix}ytmp4*

🚀 *${prefix}ytmp3* 
Mendownload lagu dari youtube.
Usage : ketik *${prefix}ytmp3*

🚀 *${prefix}free* 
lihat game gratis sekarang di epic games.
Usage : ketik *${prefix}free*

🚀 *${prefix}up* 
Lihat game gratis mendatang di epic games.
Usage : ketik *${prefix}up*

`
}

exports.textownermenu = () => {
    return `
   
   Berikut fitur yang dapat di gunakan pada bot ini✨
   
   Tentang Bot:
   
   1. *${prefix}tnc*
   Untuk mendapatkan info bot
   
   
   2. *${prefix}join*
   membuat bot join ke grupmu tapi ada syaratnya oakwowkw
   
   Owner Bot:
   
   1. *${prefix}ban* - banned
   fitur owner
   
   2. *${prefix}bc* - promosi
   fitur owner
   
   3. *${prefix}leaveall* - keluar semua grup
   fitur owner
   
   4. *${prefix}clearall* - hapus semua chat
   fitur owner
   
`
}

exports.textAdmin = () => {
    return `
⚠ [ *Admin Group Only* ] ⚠ 

🐼 *${prefix}add*
🐼 *${prefix}kick* @tag
🐼 *${prefix}promote* @tag
🐼 *${prefix}mutegrup* 
🐼 *${prefix}setprofile* 
🐼 *${prefix}demote* @tag
🐼 *${prefix}tagall*
🐼 *${prefix}del*

_-_-_-_-_-_-_-_-_-_-_-_-_-_

⚠ [ *Owner Group Only* ] ⚠
🐼 *${prefix}kickall*

`
}



// │ ├─ ❏ ◪ └─
exports.info = (pushname , runtime) => {
    return `
    ◪ 𝗜𝗡𝗙𝗢
    ❏ User : ${pushname}
    ❏ Versi : 2.0.0
    ❏ Liberary : whiskeysocket
    ❏ Prefix: 「  .  」
    ❏ Runtime : ${runtime}

    ◪ 𝗦𝗬𝗦𝗧𝗘𝗠
    │
    ├─ ❏ bc
    ├─ ❏ 
    ├─ ❏ 
    └─ ❏ ping

    ◪ *TOOLS*
    │
    ├─ ❏ artinama
    ├─ ❏ cekkhodam
    ├─ ❏ spotifysearch
    ├─ ❏ pantun
    ├─ ❏ fakta
    └─ ❏ translate

    ◪ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥
    │
    ├─ ❏ ytmp3
    ├─ ❏ ytmp4
    ├─ ❏ tkmp4
    ├─ ❏ tkmp3
    ├─ ❏ ig
    ├─ ❏ igs
    ├─ ❏ 
    └─ ❏
    ◪ *EDUKASI* + *TOBAT*
    │
    ├─ ❏ Alaudio
    ├─ ❏ tafsir
    ├─ ❏ surah
    ├─ ❏ infosurah
    ├─ ❏ wiki
    ├─ ❏ 
    └─ ❏

    ◪ *GAME*
    │
    ├─ ❏ free
    ├─ ❏ up
    ├─ ❏ 
    └─ ❏

    ◪ 𝗚𝗥𝗢𝗨𝗣
    │
    ├─ ❏ promote
    ├─ ❏ demote
    ├─ ❏ add
    ├─ ❏ kick
    ├─ ❏ del
    └─ ❏ tagall

`}





