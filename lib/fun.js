const fs = require('fs');
const list = JSON.parse(fs.readFileSync('./settings/khodam.json'))
const axios = require('axios');
const { log } = require('console');
const { courier } = require('./constant')
const key = JSON.parse(fs.readFileSync('./settings/key.json'));
const cekKhodam = () => {
    const khodamMu = list[Math.floor(Math.random() * list.length)]
    // console.log(random)
    // console.log(khodamMu)
    return khodamMu

}

const spotifySearch = async (search) => new Promise((resolve, reject) => {

    // search = '1nonly';
    const options = {
        method: 'GET',
        url: 'https://spotify-scraper.p.rapidapi.com/v1/search',
        params: {
          term: search,
          type: 'all'
        },
        headers: {
          'x-rapidapi-key': '766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46',
          'x-rapidapi-host': 'spotify-scraper.p.rapidapi.com'
        }
    };
    try {
        axios.request(options)
        .then((r) => {
            const res = r.data;
            let name,shareUrl,coverUrl,duration;
            const item = res.tracks.items[Math.floor(Math.random() * (res.tracks.items).length)];
            name = item.name;
            shareUrl= item.shareUrl;
            duration = item.durationText;   
            coverUrl= item.album.cover[1].url;

            resolve({name, shareUrl,duration, coverUrl});
        })
        .catch(err =>{
            reject(err)
        })

    } catch (error) {
        reject(error)
    }

})

const linkedln = async(search, quantity) => new Promise((resolve ,reject) => {
    const options = {
        method: 'GET',
        url: 'https://linkedin-bulk-data-scraper.p.rapidapi.com/search_jobs',
        params: {
          query: search,
          page: '1'
        },
        headers: {
          'x-rapidapi-key': '766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46',
          'x-rapidapi-host': 'linkedin-bulk-data-scraper.p.rapidapi.com'
        }
      };
    try {
        
        axios.request(options)
        .then((res) => {
            if(res.status != 200) reject({"status" : res.status});
            const items= [];
            for (let i = 0; i < Math.min(quantity, res.data.response.jobs.length); i++) {
                const e = res.data.response.jobs[i];
                const title = e.data.title;
                const companyName = e.data.companyName || "";
                const location= e.data.formattedLocation;
                const industries= e.data.formattedIndustries;
                const jobdesc = e.data.jobDescription;
                const url = e.data.jobPostingUrl;

                items.push({title,companyName,location,industries,jobdesc,url});
            }
            // log(items)
            resolve(items);
        })
        .catch(err =>{
            reject(err)
        })
    } catch (error) {
        reject(error)
    }

})

const getPantun = () => {
    const data = fs.readFileSync('./temp/pantun.txt', 'utf8');
    const splitPantun = data.split('\n')
   
    const randomPantun = splitPantun[Math.floor(Math.random() * splitPantun.length)]
    const formatedPantun = randomPantun.replace(/pantun-line/g, "\n");

    // console.log(formatedPantun, "\n");
    return(formatedPantun)
    // console.log('\n\n',randomPantun);
}


const cekResi = async(resi , cou) => new Promise((resolve, reject) => {
    const url = 'https://api.binderbyte.com/v1/track'
    const apikey = key.cekresi;
    // log(apikey)
    const kurir = courier[cou];
    if(kurir == undefined) reject("kurir tidak ditemukan");
    const requestUrl = `${url}?api_key=${apikey}&courier=${kurir}&awb=${resi}`
    log(requestUrl)
    try {
        
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: requestUrl,
            headers: { }
        };
        axios.request(config)
        .then((res) => {
            if(res.data.status == 200){
                resolve(res.data.data);
            }else{
                reject(res.data.status)
            }
        })
        .catch(err => {
            reject(err)
        })

    } catch (error) {
        reject(error)
    }

    // resolve(key.cekresi)


}) 


// cekResi('582230008329223', courier.jnt)
// .then((r) => {
//     log(r)
// })


module.exports ={
    cekKhodam,
    spotifySearch,
    linkedln,
    getPantun,
    cekResi,
    

}