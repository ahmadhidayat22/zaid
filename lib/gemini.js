const fs = require("fs");
const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} = require("@google/generative-ai");
const { log } = require("console");
const key = JSON.parse(fs.readFileSync("./settings/key.json"));

const apiKey = key.gemini;
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
    temperature: 1.55,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
const safetySetting = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig,
    safetySetting
});

let parts = [
    {
      "role": "user",
      "parts": [
        {
          "text": "Hai bro, lagi ngapain?"
        }
      ]
    },
    {
      "role": "model",
      "parts": [
        {
          "text": "Halo cuy, lagi nonton film nih. kenapa?"
        }
      ]
    },
    {
      "role": "user",
      "parts": [
        {
          "text": "nama mu siapa?"
        }
      ]
    },
    {
      "role": "model",
      "parts": [
        {
          "text": "namaku zaid, mau nanya apa lagi kamu?? "
        }
      ]
    },
]

const addMessageToHistory = (text, pathName, results) => {
   
    try {
        if(!fs.existsSync(pathName)){
            console.log(`File ${pathName} not exists. Skipping.`);
            return;
        }else{
            fs.writeFileSync(pathName, JSON.stringify(parts, null, 2));
        }
        
        
        // Menulis kembali data yang diperbarui ke file JSON
        
    } catch (error) {
        console.log(error);
    }
};

const gemini = (text, chatId) =>{
	return new Promise(async (resolve, rejects) => {
        const pathName = `./temp/${chatId}.json`

        if (fs.existsSync(pathName)) {
            // Cek apakah file tidak kosong (tidak hanya berisi array kosong)
            const data = fs.readFileSync(pathName, 'utf8');
            partsInUser = JSON.parse(data);
            if (Array.isArray(parts) && partsInUser.length !== 0) {
                console.log(`parts in ${pathName} is Exists.`);
                parts = partsInUser;
            }else{
                parts = [
                    {
                      "role": "user",
                      "parts": [
                        {
                          "text": "Hai bro, lagi ngapain?"
                        }
                      ]
                    },
                    {
                      "role": "model",
                      "parts": [
                        {
                          "text": "Halo cuy, lagi nonton film nih. ada yang bisa ku bantu?"
                        }
                      ]
                    },
                    {
                      "role": "user",
                      "parts": [
                        {
                          "text": "nama mu siapa?"
                        }
                      ]
                    },
                    {
                      "role": "model",
                      "parts": [
                        {
                          "text": "namaku zaid, kamu bisa tanya apa saja yang kau mau"
                        }
                      ]
                    },
                ]

            }
        }

        const chat = model.startChat({
            history: parts,
        });
        
		try {
            let result = await chat.sendMessage(text);
            const hasil = result.response.text();
            
            // Tambahkan input user ke JSON parts
            addMessageToHistory(text, pathName ,hasil );

            resolve(hasil);
		} catch (error) {
            rejects(error)
        }

})}

module.exports ={
    gemini
}