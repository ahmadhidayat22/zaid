/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */
const fs = require("fs");
const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} = require("@google/generative-ai");
const { log } = require("console");
const key = JSON.parse(fs.readFileSync("./settings/key.json"));
let parts = JSON.parse(fs.readFileSync('./settings/tuning.json', 'utf-8'));

// const model = genAI.getGenerativeModel({
// model: "gemini-1.5-flash",
// });

// console.log(parts)

// async function run(text) {

//     const chat = model.startChat({ history: parts });
//     // const result = await model.generateContent({
//     //     contents: [{ role: "user", parts }],
//     //     generationConfig,
//     // // safetySettings: Adjust safety settings
//     // // See https://ai.google.dev/gemini-api/docs/safety-settings
//     // });
//     // const res2 = await model.generateContent({
//     //     contents : [{ role:  "user", text}],
//     //     generationConfig,
//     // });

//     log(res2.response.text())
//     log("\n\n\n",res2)
// //  console.log(result.response.text());
// }

// run("lu ada saran film indo yang bagus gak akhir-akhir ini?");
const apiKey = key.gemini;
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
    temperature: 1.55,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig,
});

// log(parts)
// log(JSON.stringify(parts, null, 2))

// parts.push({
//     role: "user",
//     parts: [{ text: "Apa rekomendasi film kamu?" }],
// });


// // Tambahkan respons model ke JSON parts
// parts.push({
//     role: "model",
//     parts: [{ text: "Wah, film favoritku banyak banget! Tapi, kamu suka film genre apa? Biar aku bisa kasih rekomendasi yang pas.  \n\nKalo kamu suka:\n\n* **Aksi**: John Wick, Mad Max: Fury Road, The Raid: Redemption\n* **Komedi**:  The Hangover, Bridesmaids, 21 Jump Street\n* **Horor**:  The Conjuring, Hereditary, Get Out\n* **Sci-Fi**:  Interstellar, Arrival, Inception\n* **Drama**: The Godfather, Schindler's List, The Shawshank Redemption\n\nKalo kamu masih bingung, aku bisa rekomendasiin beberapa film yang baru aja aku tonton dan bagus banget, gimana? \n" }],
// });
// log(JSON.stringify(parts, null, 2))
const addMessageToHistory = (role, text) => {
    parts.push({
        role: role,
        parts: [{ text: text }]
    });
    
    // Menulis kembali data yang diperbarui ke file JSON
    fs.writeFileSync('./settings/tuning.json', JSON.stringify(parts, null, 2));
};

const gemini = async(text) =>{
	return new Promise(async (resolve, rejects) => {
		
        const chat = model.startChat({
            history: parts,
        });
        
		try {
            let result = await chat.sendMessage(text);
            const hasil = await result.response.text();
            
            // Tambahkan input user ke JSON parts
            addMessageToHistory("user", text);

            // Tambahkan respons model ke JSON parts
            addMessageToHistory("model", hasil);

            resolve(hasil);
		} catch (error) {
            rejects(error)
        }
		// result = await chat.sendMessage("cara supaya kurus");
		// console.log(result.response.text());
})}

// gemini("film action seru gak?")
// .then(async(res) => {
//     console.log("Model:", res);
//     console.log("History:", JSON.stringify(parts, null, 2));
    

// })

(async () => {
    try {
        let response = await gemini("Apa rekomendasi film kamu?");
        console.log("Model:", response);

        response = await gemini("Kenapa suka film itu?");
        console.log("Model:", response);

        // Menampilkan history percakapan
        console.log("History:", JSON.stringify(parts, null, 2));
    } catch (error) {
        console.error(error);
    }
})();
module.exports ={
    gemini
}