const fs = require('fs')
const key = JSON.parse(fs.readFileSync("./settings/key.json"));
const { GoogleGenerativeAI } = require("@google/generative-ai");


const genet = async() => {
    
    // const text = `
    // Laut biru luas terbentang pantun-line 
    // Gelombang berdesir lembut menyapa pantai pantun-line
    // Hidup ini penuh dengan misteri pantun-line
    // Janganlah takut hadapi tantangannya pantun-line

    // Jalan-jalan ke taman bunga pantun-line 
    // Melihat kupu-kupu terbang melayang pantun-line
    // Cintailah hidup dengan bahagia pantun-line
    // Lupakan masalah yang merisaukan pantun-line

    // `
    
    // console.log(trimmed.join('\n'))
    const genAI = new GoogleGenerativeAI(key.gemini);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = "buatkan 10 teks raw pantun random dan di tiap ujung baris beri pantun-line ,tanpa nomor ,tanpa heading"
  
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();


    // console.log(text);
    // // console.log("\n\n",text.trimEnd());
    
    const outputPath = './temp/pantun2.txt';
    // // console.log(`Pantun saved to ${outputPath}`);
    
    // console.log(formattedText);
    const paragraf = text.trimEnd().split('\n\n')

    const trimmed = paragraf.map((e) => {

        return e.split('\n').join(' ')
    })
    const formattedText = trimmed.join('\n');

    console.log(formattedText)
    fs.writeFileSync(outputPath, formattedText, 'utf8');

}

const getPantun = () => {
    const data = fs.readFileSync('./temp/pantun.txt', 'utf8');
    const splitPantun = data.split('\n')
   
    const randomPantun = splitPantun[Math.floor(Math.random() * splitPantun.length)]
    const formatedPantun = randomPantun.replace(/pantun-line/g, "\n");

    console.log(formatedPantun, "\n");
    // console.log('\n\n',randomPantun);
}



// genet()