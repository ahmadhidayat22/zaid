const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Makassar").locale("id");
const fs = require("fs-extra");
const axios = require("axios");
const { color } = require("./utils");
const { decryptMedia } = require("@open-wa/wa-automate");
const mime = require("mime-types");
const fss = require("fs");
const path = require("path");
const Math_js = require("mathjs");
const { Canvacord, Welcomer, Leaver, Rank } = require("canvacord");
const { tmpdir } = require("os");
const Crypto = require("crypto");
const ff = require("fluent-ffmpeg");
const webp = require("node-webpmux");

//const errorImgg = "https://i.ibb.co/jRCpLfn/user.png";
const errorImgg= fs.readFileSync(path.join(__dirname, "media/empty_profile.jpg"))

const get = require("got");
const { TiktokDL } = require("@tobyg74/tiktok-api-dl");

const sleep = async (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

////////////////////MENU///////////////////////////
const { menu, filetype, convert, point, fun, ai } = require("./lib");
const { log } = require("console");

const { isUrl, processTime } = require("./utils");
const kuismtk = JSON.parse(fs.readFileSync("./settings/kuismtk.json"));
const kuismtkk = JSON.parse(fs.readFileSync("./settings/kuismtkk.json"));
//////////////////////////////FOLDER SYSTEM///////////////////////////////////
const setting = JSON.parse(fs.readFileSync("./settings/setting.json"));
const banned = JSON.parse(fs.readFileSync("./settings/banned.json"));
const key = JSON.parse(fs.readFileSync("./settings/key.json"));
const kuis = JSON.parse(fs.readFileSync("./settings/kuis.json"));
let mtkeasy = JSON.parse(fs.readFileSync("./settings/mtkeasy.json"));
let mtkmedium = JSON.parse(fs.readFileSync("./settings/mtkmedium.json"));
let mtkhard = JSON.parse(fs.readFileSync("./settings/mtkhard.json"));
let easy = JSON.parse(fs.readFileSync("./settings/easy.json"));
let medium = JSON.parse(fs.readFileSync("./settings/medium.json"));
let hard = JSON.parse(fs.readFileSync("./settings/hard.json"));
const _point = JSON.parse(fs.readFileSync("./settings/point.json"));
let updateBot = JSON.parse(fs.readFileSync("./settings/update.json"));
let jadwal = JSON.parse(fs.readFileSync("./settings/jadwal.json"));
let { ownerNumber, groupLimit, limitCount, memberLimit, prefix } = setting;

module.exports = message = async (m, message, startTime) => {
	try {
		let _user = JSON.parse(fs.readFileSync("./settings/user.json"));
		
		const banned = JSON.parse(fs.readFileSync("./settings/banned.json"));
		const timerEasy = 5000;
		const timerMed = 10000;
		const timerHard = 20000;

		const {
			type,
			id,
			content,
			from,
			t,
			sender,
			isGroupMsg,
			chat,
			chatId,
			caption,
			isMedia,
			mimetype,
			quotedMsg,
			author,
			quotedMsgObj,
			mentionedJidList,
		} = message;
		let { body } = message;
		body = type === "chat"
			? body
			: type === "image" || type === "video"
			? caption
			: "";

		//log(message);
		var { items, name, formattedTitle } = chat;
		let { text } = message;
		let { pushname, formattedName } = sender;
		const botNumber = (await m.getHostNumber()) + "@c.us";
		const groupId = isGroupMsg ? chat.groupMetadata.id : "";
		const groupAdmins = isGroupMsg ? await m.getGroupAdmins(groupId) : "";
		const groupMembers = isGroupMsg ? await m.getGroupMembersId(groupId) : "";
		// const isOwner = sender.id === ownerNumber.includes
		const isGroupAdmins = groupAdmins.includes(sender.id) || false;
		var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";

		const chats =
			type === "chat"
				? body
				: type === "image" || type === "video"
				? caption
				: "";
		const pengirim = sender.id;
		const time = moment(t * 1000).format("DD/MM/YY HH:mm:ss");
		
		// Bot Prefix
		body = type === "chat" && body.startsWith(prefix)
				? body
				: (type === "image" || type === "video" || type === "document") &&
				  caption &&
				  caption.startsWith(prefix)
				? caption
				: "";
		
		const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
		// log(command)
		const commandd = caption || body || "";
		const arg = body.substring(body.indexOf(" ") + 1);
		const validMessage = caption ? caption : body;
		const arguments = validMessage.trim().split(" ").slice(1);
		const args = body.trim().split(/ +/).slice(1);
		const argv = body.slice(1).trim().split(/ +/).shift().toLowerCase();
		const isCmd = body.startsWith(prefix);
        const isImage = type === 'image'
		
		// log(body)
		const argus = commandd.split(" ");

		
		const teks = args.join(" ");
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
		const isQuotedImage = quotedMsg && quotedMsg.type === "image";
		const uaOverride = process.env.UserAgent;
		const url = args.length !== 0 ? args[0] : "";
		const isKuis = isGroupMsg ? kuis.includes(chat.id) : false;
		const isMtk = isGroupMsg ? kuismtk.includes(chat.id) : false;
		const isMtkk = isGroupMsg ? kuismtkk.includes(chat.id) : false;
		const checkStat = isCmd && command == "mystat" ? true : false;
		const isTeks = args.length == 0 ? true : false;
		const pathname = `./temp/${chatId}.json`;

		// .b hello world [ 'hello' , 'wordl'] [ 'hello' , ' world'] b [ '.b', 'hello' ] hello
		// console.log(validMessage, arguments, args, argv , argus ,q);

		function truncateText(text, maxLength) {
			if (text.length <= maxLength) {
				return text;
			}

			const truncatedText = text.substring(0, maxLength);

			// Check if the last character is a space
			if (truncatedText.endsWith(" ")) {
				return truncatedText;
			} else {
				// If not, add ellipsis (...) to the end of the string
				return `${truncatedText}...`;
			}
		}

		const originalText = teks;
		const maxLength = 30;
		const teks_singkat = truncateText(originalText, maxLength);
		let _isRegistered = false; // dont delete if 'is declared but never used'

		//   console.log(truncatedText); // Output: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."

		// [IDENTIFY]
		const isOwnerBot = ownerNumber.includes(pengirim);
		const isBanned = banned.includes(pengirim);
		// log(chat.id, chatId)
		const SaveUserHistoryAi = async (userdata) => {
			const dir = "./temp";
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			try {
				await userdata.forEach((item) => {
					const filePath = `${dir}/${item}.json`; // Buat nama file berdasarkan ID

					if (fs.existsSync(filePath)) {
						console.log(`File ${filePath} already exists. Skipping.`);
						return;
					}
					// const jsonData = JSON.stringify(item, null, 2); // Konversi data ke format JSON dengan indentsi 2

					// Tulis data ke file JSON
					fs.writeFile(filePath, "[]", "utf8", (err) => {
						if (err) {
							console.error(`Error writing file ${filePath}:`, err);
						} else {
							console.log(`File ${filePath} has been saved.`);
						}
					});
				});
			} catch (error) {
				console.log(color("ERROR", "red"), error);
			}
		};
		const saveUser = async () => {
			try {
				if (_user.length === 0) {
					_isRegistered = true;
					_user.push(chat.id);
					await fs.promises.writeFile(
						"./settings/user.json",
						JSON.stringify(_user, null, 2)
					);
					await SaveUserHistoryAi(_user);
					console.log("Success: Added new user data");
				} else {
					const isExist = _user.includes(chat.id);
					if (!isExist) {
						_user.push(chat.id);
						_isRegistered = true;
						await fs.promises.writeFile(
							"./settings/user.json",
							JSON.stringify(_user, null, 2)
						);
						await SaveUserHistoryAi(_user);
						console.log("Success: Saved user data");
					}
				}
			} catch (error) {
				console.error("Error saving user data:", error);
			}
		};

		if (isCmd && !isGroupMsg && !isBanned)
			console.log(
				color("[CMD]"),
				color(time, "yellow"),
				color(`${prefix}${command} [${teks_singkat}]`),
				"from",
				color(pushname)
			);
		if (isCmd && isGroupMsg && !isBanned)
			console.log(
				color("[CMD]"),
				color(time, "yellow"),
				color(`${prefix}${command} [${teks_singkat}]`),
				"from",
				color(pushname),
				"in",
				color(name || formattedTitle)
			);
		if (isCmd && isBanned && !isGroupMsg && !checkStat)
			return console.log(
				color("[BAN]", "red"),
				color(time, "yellow"),
				color(`${command} [${args.length}]`),
				"from",
				color(pushname)
			);
		if (isCmd && isBanned && isGroupMsg && !checkStat)
			return console.log(
				color("[BAN]", "red"),
				color(time, "yellow"),
				color(`${command} [${args.length}]`),
				"from",
				color(pushname),
				"in",
				color(name || formattedTitle)
			);

		const calcRuntime = () => {
			const endTime = Date.now();
			const runtime = endTime - startTime;

			let seconds = Math.floor((runtime / 1000) % 60);
			let minutes = Math.floor((runtime / (1000 * 60)) % 60);
			let hours = Math.floor((runtime / (1000 * 60 * 60)) % 24);
			let days = Math.floor(runtime / (1000 * 60 * 60 * 24));
			// console.log(seconds , minutes ,hours);

			let formattedTime = "";
			if (days > 0) {
				formattedTime += `${days} hari `;
			}
			if (hours > 0) {
				formattedTime += `${hours} jam `;
			}
			if (minutes > 0) {
				formattedTime += `${minutes} menit `;
			}
			if (seconds > 0) {
				formattedTime += `${seconds} detik`;
			}

			return formattedTime.trim();
		};

		const sayWelcome = async (userId) => {
			try {
				userId += "@c.us";
				// log(userId,from, id)
				const user = await m.getContact(userId);
				const { id, verifiedName, pushname , name} = user;

				const ppLinks = await m.getProfilePicFromServer(userId);
				if (ppLinks === undefined || ppLinks == "ERROR: 404" || ppLinks == "ERROR: 401") {
					var pepe = errorImgg;
				} else {
					pepe = ppLinks;
				}
				//log(name,formattedTitle, ppLinks)
				const card = new Welcomer()
					.setAvatar(pepe)
					.setUsername(verifiedName || pushname || name)
					.setDiscriminator(id.substring(6, 10))
					.setGuildName(name || formattedTitle)
					.setMemberCount(groupMembers.length);

				card
					.build()
					.then(async (buffer) => {
						const imageBase64 = `data:image/png;base64,${buffer.toString(
							"base64"
						)}`;
						await m.sendImage(from, imageBase64, "welcome.png", "", userId);
					})
					.catch(async (err) => {
						console.error(err);
						// await m.reply(from, 'Error!', id)
					});
			} catch (error) {
				console.log(color("error", "red"), error);
			}
		};

		const sayLeaver = async (userId) => {
			try {
				// log(userId,from, id)
				const user = await m.getContact(userId);
				const { id, verifiedName, pushname , name} = user;

				const ppLinks = await m.getProfilePicFromServer(userId);
				if (ppLinks === undefined || ppLinks == "ERROR: 404" || ppLinks == "ERROR: 401") {
					var pepe = errorImgg;
				} else {
					pepe = ppLinks;
				}

				const card = new Leaver()
					.setAvatar(pepe)
					.setUsername(verifiedName || pushname || name)
					.setDiscriminator(id.substring(6, 10))
					.setGuildName(name || formattedTitle)
					.setMemberCount(groupMembers.length);

				card
					.build()
					.then(async (buffer) => {
						const imageBase64 = `data:image/png;base64,${buffer.toString(
							"base64"
						)}`;
						await m.sendImage(from, imageBase64, "welcome.png", "", userId);
					})
					.catch(async (err) => {
						console.error(err);
						// await m.reply(from, 'Error!', id)
					});
			} catch (error) {
				console.log(error);
				console.log(color("error", "red"), error);
			}
		};

		const sayMaintenance = async (In, to) => {
			await m.reply(In, "maaf fitur masih dibuat", to);
		};
		const logerr = (error) => {
			console.log(color("ERROR", 'red'), error)
		}
		async function imageToWebp(media) {
			const tmpFileOut = path.join(
			  tmpdir(),
			  `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
			);
			const tmpFileIn = path.join(
			  tmpdir(),
			  `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`
			);
		  
			fs.writeFileSync(tmpFileIn, media);
		  
			await new Promise((resolve, reject) => {
			  ff(tmpFileIn)
				.on("error", reject)
				.on("end", () => resolve(true))
				.addOutputOptions([
				  "-vcodec",
				  "libwebp",
				  "-vf",
				  "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
				])
				.toFormat("webp")
				.save(tmpFileOut);
			});
		  
			const buff = fs.readFileSync(tmpFileOut);
			fs.unlinkSync(tmpFileOut);
			fs.unlinkSync(tmpFileIn);
			return buff;
		  }
		  async function writeExifImg(media, metadata) {
			let wMedia = await imageToWebp(media);
			const tmpFileIn = path.join(
			  "./",
			  `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
			);
			const tmpFileOut = path.join(
			  "./",
			  `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
			);
			fs.writeFileSync(tmpFileIn, wMedia);
		  
			if (metadata.packname || metadata.author) {
			  const img = new webp.Image();
			  const json = {
				"sticker-pack-id": `https://github.com/DikaArdnt/Hisoka-Morou`,
				"sticker-pack-name": metadata.packname,
				"sticker-pack-publisher": metadata.author,
				emojis: metadata.categories ? metadata.categories : [""],
			  };
			  const exifAttr = Buffer.from([
				0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
				0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
			  ]);
			  const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
			  const exif = Buffer.concat([exifAttr, jsonBuff]);
			  exif.writeUIntLE(jsonBuff.length, 14, 4);
			  await img.load(tmpFileIn);
			  fs.unlinkSync(tmpFileIn);
			  img.exif = exif;
			  await img.save(tmpFileOut);
			  return tmpFileOut;
			}
		  }

		
		/////////////////////// QUIZ MTK //////////////////////////////

		if (isGroupMsg) {
			if (easy.includes(chats)) {
				await m.reply(
					from,
					`Jawaban Benar, Selamat Anda Mendapatkan 5 Points\nMau Lanjut ? Silahkan Ketik Next`,
					id
				);
				await clearTimeout(10000);
				point.addCooldown(sender.id);
				point.addLevelingPoint(sender.id, 5, _point);
				let tebakeasy = easy.indexOf(chats);
				easy.splice(tebakeasy, 1);
				log(easy, tebakeasy);
				fs.writeFileSync("./settings/easy.json", JSON.stringify(easy, null, 2));
				let kues = kuismtk.indexOf(chatId);
				kuismtk.splice(kues, 1);
				fs.writeFileSync(
					"./settings/kuismtk.json",
					JSON.stringify(kuismtk, null, 2)
				);
			}
			if (medium.includes(chats)) {
				await m.reply(
					from,
					`Jawaban Benar, Selamat Anda Mendapatkan 10 Points\nMau Lanjut ? Silahkan Ketik Next`,
					id
				);
				point.addCooldown(sender.id);
				point.addLevelingPoint(sender.id, 10, _point);
				let tebakmedium = medium.indexOf(chats);
				medium.splice(tebakmedium, 1);
				fs.writeFileSync(
					"./settings/medium.json",
					JSON.stringify(medium, null, 2)
				);
				let kues = kuismtk.indexOf(chatId);
				kuismtk.splice(kues, 1);
				fs.writeFileSync(
					"./settings/kuismtk.json",
					JSON.stringify(kuismtk, null, 2)
				);
			}
			if (hard.includes(chats)) {
				await m.reply(
					from,
					`Jawaban Benar, Selamat Anda Mendapatkan 20 Points\nMau Lanjut ? Silahkan Ketik Next`,
					id
				);
				point.addCooldown(sender.id);
				point.addLevelingPoint(sender.id, 20, _point);
				let tebakhard = hard.indexOf(chats);
				hard.splice(tebakhard, 1);
				fs.writeFileSync("./settings/hard.json", JSON.stringify(hard, null, 2));
				let kues = kuismtk.indexOf(chatId);
				kuismtk.splice(kues, 1);
				fs.writeFileSync(
					"./settings/kuismtk.json",
					JSON.stringify(kuismtk, null, 2)
				);
			}
		}

		if (chats == "Next" || chats == "next") {
			if (!isGroupMsg)
				return m.reply(
					from,
					"Perintah ini hanya bisa di gunakan dalam group!",
					id
				);
			await m.reply(from, "tunggu sebentar~", id);
			await m.reply(
				from,
				`Silahkan Pilih Level Kuiz\n*Easy*\n*Medium*\n*Hard*`,
				id
			);
			kuismtkk.push(chat.id);
			fs.writeFileSync("./settings/kuismtkk.json", JSON.stringify(kuismtkk));
		}

		if (isGroupMsg && kuismtkk.includes(chatId)) {
			if (chats == "Easy" || chats == "easy") {
				if (!isMtkk) return;
				if (isMtk) return m.reply(from, `Kuis Mtk Sedang Berlangsung`, id);
				const kuil = mtkeasy[Math.floor(Math.random() * mtkeasy.length)];
				const kuil2 = mtkeasy[Math.floor(Math.random() * mtkeasy.length)];
				const nova = ["+", "-"];
				const noval = nova[Math.floor(Math.random() * nova.length)];
				await m.reply(
					from,
					`Hasil Dari : \n${kuil} ${noval} ${kuil2} adalah`,
					id
				);

				kuismtk.push(chat.id);
				fs.writeFileSync("./settings/kuismtk.json", JSON.stringify(kuismtk));
				if (typeof Math_js.evaluate(`${kuil} ${noval} ${kuil2}`) !== "number") {
					await m.reply(from, "", id);
				} else {
					easy.push(`${Math_js.evaluate(`${kuil}${noval}${kuil2}`)}`);
					fs.writeFileSync("./settings/easy.json", JSON.stringify(easy));
				}
				let kuos = kuismtkk.indexOf(chatId);
				kuismtkk.splice(kuos, 1);
				fs.writeFileSync(
					"./settings/kuismtkk.json",
					JSON.stringify(kuismtkk, null, 2)
				);
				await m.sendText(from, `waktu anda ${timerEasy / 1000} detik`);
				await sleep(timerEasy);
				if (kuismtk.includes(chat.id)) {
					let kuii = kuismtk.indexOf(chatId);
					let res = easy.indexOf(Math_js.evaluate(`${kuil}${noval}${kuil2}`));

					kuismtk.splice(kuii, 1);
					fs.writeFileSync(
						"./settings/kuismtk.json",
						JSON.stringify(kuismtk, null, 2)
					);
					easy.splice(res, 1);
					// log(easy);

					fs.writeFileSync(
						"./settings/easy.json",
						JSON.stringify(easy, null, 2)
					);
					await m.reply(
						from,
						`waktu habis..\nJawabannya : ${Math_js.evaluate(
							`${kuil}${noval}${kuil2}`
						)}`,
						id
					);
				}
			}

			if (chats == "Medium" || chats == "medium") {
				if (!isMtkk) return;
				if (isMtk) return m.reply(from, `Kuis Mtk Sedang Berlangsung`, id);
				const kuli = mtkmedium[Math.floor(Math.random() * mtkmedium.length)];
				const kuli2 = mtkmedium[Math.floor(Math.random() * mtkmedium.length)];
				const mety = ["+", "*"];
				const meti = mety[Math.floor(Math.random() * mety.length)];
				await m.reply(
					from,
					`Hasil Dari : \n${kuli} ${meti.replace("*", "x")} ${kuli2} adalah`,
					id
				);
				kuismtk.push(chat.id);
				fs.writeFileSync("./settings/kuismtk.json", JSON.stringify(kuismtk));
				if (typeof Math_js.evaluate(`${kuli} ${meti} ${kuli2}`) !== "number") {
					await m.reply(from, ind.notNum(`${kuli}`), id);
				} else {
					medium.push(`${Math_js.evaluate(`${kuli}${meti}${kuli2}`)}`);
					fs.writeFileSync("./settings/medium.json", JSON.stringify(medium));
				}
				let kuos = kuismtkk.indexOf(chatId);
				kuismtkk.splice(kuos, 1);
				fs.writeFileSync(
					"./settings/kuismtkk.json",
					JSON.stringify(kuismtkk, null, 2)
				);
				await m.sendText(from, `waktu anda ${timerMed / 1000} detik`);
				await sleep(timerMed);
				if (kuismtk.includes(chat.id)) {
					let kuii = kuismtk.indexOf(chatId);
					let res = medium.indexOf(
						`${Math_js.evaluate(`${kuli}${meti}${kuli2}`)}`
					);
					kuismtk.splice(kuii, 1);
					log(res);
					fs.writeFileSync(
						"./settings/kuismtk.json",
						JSON.stringify(kuismtk, null, 2)
					);

					medium.splice(res, 1);
					// log(medium)
					fs.writeFileSync(
						"./settings/medium.json",
						JSON.stringify(medium, null, 2)
					);
					await m.reply(
						from,
						`waktu habis..\nJawabannya : ${Math_js.evaluate(
							`${kuli}${meti}${kuli2}`
						)}`,
						id
					);
				}
			}

			if (chats == "Hard" || chats == "hard") {
				if (!isMtkk) return;
				if (isMtk) return m.reply(from, `Kuis Mtk Sedang Berlangsung`, id);
				const kull = mtkhard[Math.floor(Math.random() * mtkhard.length)];
				const kull2 = mtkhard[Math.floor(Math.random() * mtkhard.length)];
				const udin = ["+", "*"];
				const dinu = udin[Math.floor(Math.random() * udin.length)];
				await m.reply(
					from,
					`Hasil Dari : \n${kull} ${dinu.replace("*", "x")} ${kull2} adalah`,
					id
				);
				kuismtk.push(chat.id);
				fs.writeFileSync("./settings/kuismtk.json", JSON.stringify(kuismtk));
				if (typeof Math_js.evaluate(`${kull}${dinu}${kull2}`) !== "number") {
					await m.reply(from, ind.notNum(`${kull}`), id);
				} else {
					hard.push(`${Math_js.evaluate(`${kull}${dinu}${kull2}`)}`);
					fs.writeFileSync("./settings/hard.json", JSON.stringify(hard));
				}
				let kuos = kuismtkk.indexOf(chatId);
				kuismtkk.splice(kuos, 1);
				fs.writeFileSync(
					"./settings/kuismtkk.json",
					JSON.stringify(kuismtkk, null, 2)
				);
				await m.sendText(from, `waktu anda ${timerHard / 1000} detik`);

				await sleep(timerHard);
				if (kuismtk.includes(chat.id)) {
					let kuii = kuismtk.indexOf(chatId);
					let res = hard.indexOf(
						`${Math_js.evaluate(`${kull}${dinu}${kull2}`)}`
					);
					kuismtk.splice(kuii, 1);
					fs.writeFileSync(
						"./settings/kuismtk.json",
						JSON.stringify(kuismtk, null, 2)
					);
					hard.splice(res, 1);
					fs.writeFileSync(
						"./settings/hard.json",
						JSON.stringify(hard, null, 2)
					);
					await m.reply(
						from,
						`waktu habis...\nJawabannya : ${Math_js.evaluate(
							`${kull}${dinu}${kull2}`
						)}`,
						id
					);
				}
			}
		}

		if (isCmd) {
			await saveUser();
			switch (command) {
				case "kuismtk":
					if (isMtk) return m.reply(from, `Kuis Sedang Berlangsung`, id);
					if (!isGroupMsg)
						return m.reply(
							from,
							"Perintah ini hanya bisa di gunakan dalam group!",
							id
						);

					await m.reply(
						from,
						`Silahkan Pilih Level Kuiz\n*Easy*\n*Medium*\n*Hard*`,
						id
					);
					kuismtkk.push(chat.id);
					fs.writeFileSync(
						"./settings/kuismtkk.json",
						JSON.stringify(kuismtkk)
					);
					break;
				case "leaderboard":
					if (!isGroupMsg)
						return await m.reply(from, "fitur ini hanya untuk group", id);
					const resp = _point;
					// log(_point)
					_point.sort((a, b) => (a.point < b.point ? 1 : -1));
					let leaderboard = "*── 「 LEADERBOARDS 」 ──*\n\n";
					try {
						for (let i = 0; i < resp.length; i++) {
							//log(resp[i].level);
							let roles = "Copper V";

							if (resp[i].level >= 5) roles = "Copper IV";
							if (resp[i].level >= 10) roles = "Copper III";
							if (resp[i].level >= 15) roles = "Copper II";
							if (resp[i].level >= 20) roles = "Copper I";
							if (resp[i].level >= 25) roles = "Silver V";
							if (resp[i].level >= 30) roles = "Silver IV";
							if (resp[i].level >= 35) roles = "Silver III";
							if (resp[i].level >= 40) roles = "Silver II";
							if (resp[i].level >= 45) roles = "Silver I";
							if (resp[i].level >= 50) roles = "Gold V";
							if (resp[i].level >= 55) roles = "Gold IV";
							if (resp[i].level >= 60) roles = "Gold III";
							if (resp[i].level >= 65) roles = "Gold II";
							if (resp[i].level >= 70) roles = "Gold I";
							if (resp[i].level >= 75) roles = "Platinum V";
							if (resp[i].level >= 80) roles = "Platinum IV";
							if (resp[i].level >= 85) roles = "Platinum III";
							if (resp[i].level >= 90) roles = "Platinum II";
							if (resp[i].level >= 95) roles = "Platinum I";
							if (resp[i].level >= 100) roles = "Exterminator";
							let ser = await m.getContact(_point[i].id);
							let { pushname } = ser;

							leaderboard += `${i + 1}. ${pushname}\n➸ *XP*: ${
								_point[i]?.point
							} *Level*: ${_point[i]?.level}\n➸ *Rank*: ${roles}\n\n`;
						}
						await m.reply(from, leaderboard, id);
					} catch (err) {
						console.error(err);
						await m.reply(from, "error", id);
					}
					break;

				case "points":
					// await m.reply(from, ind.wait(), id)
					const userLevel = point.getLevelingLevel(sender.id, _point);
					const userXp = point.getLevelingPoint(sender.id, _point);
					const ppLink = await m.getProfilePicFromServer(sender.id);
					if (ppLink === undefined || ppLink == "ERROR: 404" ||  ppLink == "ERROR: 401") {
						var pepe = errorImgg;
					} else {
						pepe = ppLink;
					}
					// log( sender)
					const requiredXp = 5 * Math.pow(userLevel, 2) + 50 * userLevel + 100;
					const rank = new Rank()
						.setAvatar(pepe)
						.setLevel(userLevel)
						.setLevelColor("#ffa200", "#ffa200")
						.setRank(Number(point.getUserRank(sender.id, _point)))
						.setCurrentXP(userXp)
						.setOverlay("#000000", 100, false)
						.setRequiredXP(requiredXp)
						.setProgressBar("#ffa200", "COLOR")
						.setBackground("COLOR", "#000000")
						.setUsername(pushname)
						.setDiscriminator(sender.id.substring(6, 10));
					rank
						.build()
						.then(async (buffer) => {
							const imageBase64 = `data:image/png;base64,${buffer.toString(
								"base64"
							)}`;
							await m.sendImage(from, imageBase64, "rank.png", "", id);
						})
						.catch(async (err) => {
							console.error(err);
							await m.reply(from, "Error!", id);
						});
					break;

				// case "welcome":
				// 	const ppLinks = await m.getProfilePicFromServer(sender.id);
				// 	if (ppLinks === undefined || ppLinks == "ERROR: 404" || ppLinks == "ERROR: 401") {
				// 		var pepe = errorImgg;
				// 	} else {
				// 		pepe = ppLinks;
				// 	}
				// 	const card = new Welcomer()
				// 		.setAvatar(pepe)
				// 		.setUsername(pushname)
				// 		.setDiscriminator(sender.id.substring(6, 10))
				// 		.setGuildName(name || formattedTitle)
				// 		.setMemberCount(groupMembers.length);

				// 	card
				// 		.build()
				// 		.then(async (buffer) => {
				// 			const imageBase64 = `data:image/png;base64,${buffer.toString(
				// 				"base64"
				// 			)}`;
				// 			await m.sendImage(from, imageBase64, "welcome.png", "", id);
				// 		})
				// 		.catch(async (err) => {
				// 			console.error(err);
				// 			await m.reply(from, "Error!", id);
				// 		});
				// 	break;

				case "tts":
					if (args.length === 0)
						return m.reply(
							from,
							"Kirim perintah *!tts [id, en, jp, ar] [teks]*, contoh *!tts id halo semua*",
							id
						);
					
					const ttsId = require("node-gtts")("id");
					const ttsEn = require("node-gtts")("en");
					const ttsJp = require("node-gtts")("ja");
					const ttsAr = require("node-gtts")("ar");
					const dataText = body.slice(8);
					if (dataText === "") return m.reply(from, "Baka?", id);
					if (dataText.length > 500)
						return m.reply(from, "Teks terlalu panjang!", id);
					var dataBhs = body.slice(5, 7);
					try {
						if (dataBhs == "id") {
							ttsId.save("./media/tts/resId.mp3", dataText, function () {
								m.sendPtt(from, "./media/tts/resId.mp3", id);
							});
							await sleep(1000);
							fs.unlinkSync(path.join("media", "tts", "resId.mp3"));
						} else if (dataBhs == "en") {
							ttsEn.save("./media/tts/resEn.mp3", dataText, function () {
								m.sendPtt(from, "./media/tts/resEn.mp3", id);
							});
							await sleep(1000);
	
							fs.unlinkSync(path.join("media", "tts", "resEn.mp3"));
						} else if (dataBhs == "jp") {
							ttsJp.save("./media/tts/resJp.mp3", dataText, function () {
								m.sendPtt(from, "./media/tts/resJp.mp3", id);
							});
							await sleep(1000);
	
							fs.unlinkSync(path.join("media", "tts", "resJp.mp3"));
						} else if (dataBhs == "ar") {
							ttsAr.save("./media/tts/resAr.mp3", dataText, function () {
								m.sendPtt(from, "./media/tts/resAr.mp3", id);
							});
							await sleep(1000);
	
							fs.unlinkSync(path.join("media", "tts", "resAr.mp3"));
						} else {
							await m.reply(
								from,
								"Masukkan kode bahasa : [id] untuk indonesia, [en] untuk inggris, [jp] untuk jepang, dan [ar] untuk arab\ncontoh *!tts id halo semua*",
								id
							);
						}


					} catch (error) {
						await m.reply(from, "ada yang error!", id);
						logerr(error)
					}
					
					break;

				case "clearhistory":
					try {
						if (fs.existsSync(pathname)) {
							const data = fs.readFileSync(pathname, "utf8");
							history = JSON.parse(data);
							if (Array.isArray(history) && history.length !== 0) {
								fs.writeFileSync(pathname, "[]");
								await m.reply(from, "berhasil hapus history", id);
							} else {
								await m.reply(from, "history kosong..", id);
							}
						} else {
							await m.reply(from, "Anda tidak terdaftar..", id);
						}
					} catch (error) {
						log(error);
					}

					break;
				case "b":
				case "bard":
					try {
						if (isTeks)
							return m.reply(
								from,
								`Chat dengan gemini AI\n\nContoh:\n${prefix}${command} kamu siapa?`,
								id
							);

						if (fs.existsSync(pathname)) {
							const data = fs.readFileSync(pathname, "utf8");
							sleep(800);
							history = await JSON.parse(data);
							if (Array.isArray(history) && history.length === 0) {
								await m.sendText(
									from,
									`_[pengingat]_\n_history chat mu akan disimpan sementara biar si AI bisa diajak ngobrol.._\n_ketik *${prefix}clearhistory* untuk menghapus history chat dengan AI, dan memulai dengan konteks baru_`
								);
							}
							
							ai.gemini(teks, chatId)
								.then(async (res) => {
									await m.reply(from, res, id);
								})
								.catch(async (err) => {
									await m.reply(from, `duh ada yang error\n${err}`, id);
								});
						} else {
							log("file not exists");
						}
						
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;

				case "gpt":
					if (isTeks)
						return m.reply(
							from,
							`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`,
							id
						);
					const gpt5 = {
						method: "POST",
						url: "https://chatgpt-gpt5.p.rapidapi.com/ask",
						headers: {
							"content-type": "application/json",
							"X-RapidAPI-Key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"X-RapidAPI-Host": "chatgpt-gpt5.p.rapidapi.com",
						},
						data: {
							query: text,
						},
					};

					try {
						const response = await axios.request(gpt5);
						if (response.status != 200) throw new Error();
						// if (response.status == 200) await doneEmote(mek.key);

						await m.reply(from, `${response.data.response} `, id);

						// console.log(response.data);
					} catch (error) {
						console.error(error);
						await m.reply(
							from,
							`maaf sepertinya ada yang error: ${error.message}`
						);
					}

					break;

				case "wordpdf":
					// console.log(mimetype);
					try {
						if (mimetype) {
							const filename = `${t}.${mime.extension(mimetype)}`;
							const mediaData = await decryptMedia(message);
							const imageBase64 = `data:${mimetype};base64,${mediaData.toString(
								"base64"
							)}`;
							// await m.sendImage(
							//     from,
							//     imageBase64,
							//     filename,
							//     `You just sent me this ${type}`
							//   );

							await m.reply(from, "tunggu sebentar ~", id);

							fss.writeFile(filename, mediaData, async (err) => {
								if (err) return console.log(err);

								console.log("The file was saved!");
								await convert(filetype.importAndExport.pdf, filename).then(
									async (res) => {
										if (res.success) {
											const pdffile = await fss.readFileSync(
												"./temp/results.pdf",
												{ encoding: "base64" }
											);
											await m.sendImage(
												from,
												`data:pdf;base64,${pdffile.toString("base64")}`,
												"results.pdf",
												`ini bang file pdf nya`
											);

											await fss.unlink(
												path.join(__dirname, filename),
												(err) => {
													if (err) {
														console.log(
															color("ERROR", "red"),
															`Gagal menghapus file : ${err}`
														);
													} else {
														console.log(`File  berhasil dihapus`);
													}
												}
											);

											await fss.unlink(
												path.join(__dirname, "/temp/", "results.pdf"),
												(err) => {
													if (err) {
														console.log(
															color("ERROR", "red"),
															`Gagal menghapus file : ${err}`
														);
													} else {
														console.log(`File berhasil dihapus`);
													}
												}
											);
										} else if (res.success === false) {
											await m.reply(
												from,
												`Gagal di proses: ${res.message}`,
												id
											);
										} else {
											await m.reply(
												from,
												"Gagal di proses, terdapat kesalahan yang tidak diketahui",
												id
											);
										}

										fss.unlink(path.join(__dirname, filename), (err) => {
											if (err) {
												console.log(
													color("ERROR", "red"),
													`Gagal menghapus file : ${err}`
												);
											} else {
												console.log(`File  berhasil dihapus`);
											}
										});
									}
								);
							});
						}
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}

					break;

				case "pdfword":
					try {
						if (mimetype) {
							const filename = `${t}.${mime.extension(mimetype)}`;
							const mediaData = await decryptMedia(message);
							const imageBase64 = `data:${mimetype};base64,${mediaData.toString(
								"base64"
							)}`;
							// await m.sendImage(
							//     from,
							//     imageBase64,
							//     filename,
							//     `You just sent me this ${type}`
							//   );

							await m.reply(from, "tunggu sebentar ~", id);

							fss.writeFile(filename, mediaData, async (err) => {
								if (err) return console.log(err);

								console.log("The file was saved!");
								await convert(filetype.importAndExport.docx, filename).then(
									async (res) => {
										if (res.success) {
											const pdffile = await fss.readFileSync(
												"./temp/results.docx",
												{ encoding: "base64" }
											);
											await m.sendImage(
												from,
												`data:pdf;base64,${pdffile.toString("base64")}`,
												"results.docx",
												`ini bang file docx nya`
											);

											await fss.unlink(
												path.join(__dirname, "/temp/", "results.docx"),
												(err) => {
													if (err) {
														console.log(
															color("ERROR", "red"),
															`Gagal menghapus file : ${err}`
														);
													} else {
														console.log(`File berhasil dihapus`);
													}
												}
											);
										} else if (res.success === false) {
											await m.reply(
												from,
												`Gagal di proses: ${res.message}`,
												id
											);
										} else {
											await m.reply(
												from,
												"Gagal di proses, terdapat kesalahan yang tidak diketahui",
												id
											);
										}

										fss.unlink(path.join(__dirname, filename), (err) => {
											if (err) {
												console.log(
													color("ERROR", "red"),
													`Gagal menghapus file : ${err}`
												);
											} else {
												console.log(`File  berhasil dihapus`);
											}
										});
									}
								);
							});
						}
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;
				case "jadwal":
					const date = new Date();
					const day = date.getDay();
					const waktuskrg = moment().format('dddd, Do MMM YYYY')
			
					const jdwll = jadwal[0];
					try {
						let currJdwl, upJdwl;

						const mappingJdwl = async(hari) => {
							
							let pesan = `${hari.toUpperCase()}\n`;
							await jdwll[hari].forEach(i => {
								pesan += `${i}\n`
							})
							return(pesan)
															
						}
						

						// 0 = minggu, 1 = senin, ..., 6 = sabtu 
						switch (day) {
							case 0:
								currJdwl =  await mappingJdwl("minggu");;
								upJdwl = await mappingJdwl("senin");

								break;
							case 1:
								currJdwl =  await mappingJdwl("senin");
								upJdwl = await mappingJdwl("selasa");
								break;

							case 2:
								currJdwl =  await mappingJdwl("selasa");
								upJdwl = await mappingJdwl("rabu");
								break;

							case 3:
								currJdwl =  await mappingJdwl("rabu");
								upJdwl = await mappingJdwl("kamis");
								break;

							case 4:
								currJdwl =  await mappingJdwl("kamis");
								upJdwl = await mappingJdwl("jumat");
								break;

							case 5:
								currJdwl =  await mappingJdwl("jumat");
								upJdwl = await mappingJdwl("sabtu");
								break;

							case 6:
								currJdwl =  await mappingJdwl("sabtu");
								upJdwl = await mappingJdwl("minggu");
								break;


							default:
								break;
						
								
							}
						await m.reply(from, `_${waktuskrg}_\n\n*Hari ini*\n${ currJdwl } \n\n*Besok*\n${upJdwl}`, id)

					} catch (error) {
						logerr(error);
						await m.reply(from, "ada yang error", id);

					}
					break;
				case "lsjadwal":
					try {
						let jadwalMsg = ''
						const jdwl = jadwal[0]
						Object.keys(jdwl).forEach(e => {
							jadwalMsg += `${e.toUpperCase()}\n`
							jdwl[e].forEach(i => {
								jadwalMsg += `${i}\n`
							})
							jadwalMsg += `\n`
						});
						await m.reply(from, jadwalMsg, id);


					} catch (error) {
						logerr(error);
						await m.reply(from, "ada yang error", id);
					}
					break;
				///////////////////////////////////// MENU //////////////////////////////////////
				case "info":
					const endTime = calcRuntime();
					await m.sendText(from, menu.info(pushname, endTime));
					break;

				case "menu":
					await m.reply(from, menu.listMenu(), id);
					break;
				case "menuadmin":
					if (!isGroupAdmins)
						return await m.reply(
							from,
							"hanya admin group yang bisa menggunakan menu ini",
							id
						);
					await m.reply(from, menu.textAdmin(), id);
					break;
				case "menupenting":
					await m.reply(from, menu.menupenting(), id);
					break;
				case "menuowner":
					if (!isOwnerBot)
						return await m.reply(
							from,
							"hanya owner yang bisa menggunakan menu ini",
							id
						);

					await m.reply(from, menu.textownermenu(), id);
					break;

				/////////////////////////////////// MENU ADMIN GRUP //////////////////////////////////

				case "add":
					if (!isGroupMsg)
						return m.reply(from, "maaf hanya bisa dipakai di dalam grup", id);

					if (!isGroupAdmins)
						return m.reply(
							from,
							"Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
							id
						);

					if (!isBotGroupAdmins)
						return m.reply(
							from,
							"Gagal, silahkan tambahkan bot sebagai admin grup!",
							id
						);

					if (isTeks)
						return m.reply(
							from,
							`Untuk menggunakan ${prefix}add\nPenggunaan: ${prefix}add <nomor>\ncontoh: ${prefix}add 628888888`,
							id
						);

					try {
						await m.addParticipant(from, `${args[0]}@c.us`).then(async () => {
							await sayWelcome(args[0]);
						});
					} catch (err) {
						m.reply(
							from,
							`kesalahan, pastikan format benar\ncontoh: 0812345678 atau 62888888888 `,
							id
						);
						console.log(color("ERROR", "red"), err);
					}

					break;
				case "kick":
					if (!isGroupMsg)
						return m.reply(from, "maaf hanya bisa dipakai di dalam grup", id);

					if (!isGroupAdmins)
						return m.reply(
							from,
							"Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
							id
						);

					if (!isBotGroupAdmins)
						return m.reply(
							from,
							"Gagal, silahkan tambahkan bot sebagai admin grup!",
							id
						);

					if (mentionedJidList[0] === botNumber)
						return await m.reply(
							from,
							"Maaf, format pesan salah.\nTidak dapat mengeluarkan akun bot sendiri",
							id
						);
					try {
						await m.sendTextWithMentions(
							from,
							`Request diterima, mengeluarkan:\n${mentionedJidList
								.map((x) => `@${x.replace("@c.us", "")}`)
								.join("\n")}`
						);
						for (let i = 0; i < mentionedJidList.length; i++) {
							if (groupAdmins.includes(mentionedJidList[i]))
								return await m.sendText(
									from,
									"Gagal, kamu tidak bisa mengeluarkan admin grup."
								);
							await sayLeaver(mentionedJidList[i]);
							await m.removeParticipant(groupId, mentionedJidList[i]);
						}
					} catch (err) {
						console.log(color("ERROR", "red"), err);
					}
					break;
				case "promote":
					if (!isGroupMsg)
						return m.reply(from, "maaf hanya bisa dipakai di dalam grup", id);

					if (!isGroupAdmins)
						return m.reply(
							from,
							"Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
							id
						);

					if (!isBotGroupAdmins)
						return m.reply(
							from,
							"Gagal, silahkan tambahkan bot sebagai admin grup!",
							id
						);
					if (groupAdmins.includes(mentionedJidList[0]))
						return await m.reply(
							from,
							"Maaf, user tersebut sudah menjadi admin.",
							id
						);
					if (mentionedJidList[0] === botNumber)
						return await m.reply(
							from,
							"Maaf, format pesan salah.\nTidak dapat mempromote akun bot sendiri",
							id
						);

					try {
						await m.promoteParticipant(groupId, mentionedJidList[0]);
						await m.sendTextWithMentions(
							from,
							`Request diterima, menambahkan @${mentionedJidList[0].replace(
								"@c.us",
								""
							)} sebagai admin.`
						);
					} catch (err) {
						console.log(color("ERROR", "red"), err);
					}

					break;
				case "demote":
					if (!isGroupMsg)
						return m.reply(from, "maaf hanya bisa dipakai di dalam grup", id);

					if (!isGroupAdmins)
						return m.reply(
							from,
							"Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
							id
						);

					if (!isBotGroupAdmins)
						return m.reply(
							from,
							"Gagal, silahkan tambahkan bot sebagai admin grup!",
							id
						);
					if (mentionedJidList.length > 1)
						return m.reply(from, "Maaf, hanya bisa mendemote 1 user", id);
					if (!groupAdmins.includes(mentionedJidList[0]))
						return await m.reply(
							from,
							"Maaf, user tersebut belum menjadi admin.",
							id
						);
					if (mentionedJidList[0] === botNumber)
						return await m.reply(
							from,
							"Maaf, format pesan salah.\nTidak dapat mendemote akun bot sendiri",
							id
						);

					try {
						await m.demoteParticipant(groupId, mentionedJidList[0]);
						await m.sendTextWithMentions(
							from,
							`Request diterima, menghapus jabatan @${mentionedJidList[0].replace(
								"@c.us",
								""
							)}.`
						);
					} catch (err) {
						console.log(color("ERROR", "red"), err);
					}
					break;
				case "tagall":
					if (!isGroupMsg)
						return m.reply(from, "maaf hanya bisa dipakai di dalam grup", id);

					if (!isGroupAdmins)
						return m.reply(
							from,
							"Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
							id
						);

					try {
						const groupMem = await m.getGroupMembers(groupId);
						let hehex = "╔══✪〘 Mention All 〙✪══\n";
						for (let i = 0; i < groupMem.length; i++) {
							hehex += "╠➥";
							hehex += ` @${groupMem[i].id.replace(/@c.us/g, "")}\n`;
						}
						hehex += "╚═════════════════";
						await m.sendTextWithMentions(from, hehex);
					} catch (err) {
						console.log(color("ERROR", "red"), err);
					}

					break;
				case "del":
					if (!isGroupMsg)
						return m.reply(from, "maaf hanya bisa dipakai di dalam grup", id);
					if (!isGroupAdmins)
						return m.reply(
							from,
							"Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
							id
						);
					if (!quotedMsg)
						return m.reply(
							from,
							`Maaf, format pesan salah silahkan.\nReply pesan bot dengan caption ${prefix}del`,
							id
						);
					try {
						m.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
					} catch (err) {
						console.log(color("ERROR", "red"), err);
					}

					break;
				case "mutegrup":
					if (!isGroupMsg)
						return m.reply(from, "maaf hanya bisa dipakai di dalam grup", id);
					if (!isGroupAdmins)
						return m.reply(
							from,
							"Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
							id
						);
					if (!isBotGroupAdmins)
						return m.reply(
							from,
							"Gagal, silahkan tambahkan bot sebagai admin grup!",
							id
						);
					if (args.length !== 1)
						return m.reply(
							from,
							`Untuk mengubah settingan group chat agar hanya admin saja yang bisa chat\n\nPenggunaan:\n${prefix}mutegrup on (aktifkan)\n${prefix}mutegrup off (nonaktifkan)`,
							id
						);

					try {
						if (args[0] == "on") {
							m.setGroupToAdminsOnly(groupId, true).then(() =>
								m.sendText(
									from,
									"Berhasil mengubah agar hanya admin yang dapat chat!"
								)
							);
						} else if (args[0] == "off") {
							m.setGroupToAdminsOnly(groupId, false).then(() =>
								m.sendText(
									from,
									"Berhasil mengubah agar semua anggota dapat chat!"
								)
							);
						} else {
							m.reply(
								from,
								`Untuk mengubah settingan group chat agar hanya admin saja yang bisa chat\n\nPenggunaan:\n${prefix}mutegrup on --aktifkan\n${prefix}mutegrup off --nonaktifkan`,
								id
							);
						}
					} catch (err) {
						console.log(color("ERROR", "red"), err);
					}
					break;
				case "setprofile":
					if (!isGroupMsg)
						return m.reply(
							from,
							"Maaf, perintah ini hanya dapat dipakai didalam grup!",
							id
						);
					if (!isGroupAdmins)
						return m.reply(
							from,
							"Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
							id
						);
					if (!isBotGroupAdmins)
						return m.reply(
							from,
							"Gagal, silahkan tambahkan bot sebagai admin grup!",
							id
						);
					try {
						if ((isMedia && type == "image") || isQuotedImage) {
							const dataMedia = isQuotedImage ? quotedMsg : message;
							const _mimetype = dataMedia.mimetype;
							const mediaData = await decryptMedia(dataMedia);
							const imageBase64 = `data:${mimetype};base64,${mediaData.toString(
								"base64"
							)}`;
							await m.setGroupIcon(groupId, imageBase64);
							await m.reply(from, "Berhasil mengubah profile group", id);
						} else if (args.length === 1) {
							if (!isUrl(url)) {
								await m.reply(
									from,
									"Maaf, link yang kamu kirim tidak valid.",
									id
								);
							}
							await m
								.setGroupIconByUrl(groupId, url)
								.then((r) =>
									!r && r !== undefined
										? m.reply(
												from,
												"Maaf, link yang kamu kirim tidak memuat gambar.",
												id
										  )
										: m.reply(from, "Berhasil mengubah profile group", id)
								);
						} else {
							m.reply(
								from,
								`Commands ini digunakan untuk mengganti icon/profile group chat\n\n\nPenggunaan:\n1. Silahkan kirim sebuah gambar dengan caption ${prefix}setprofile\n\n2. Silahkan ketik ${prefix}setprofile linkImage`,
								id
							);
						}
					} catch (error) {
						console.log(color("ERR", "red"), error);
						await m.reply(from, "error", id);
					}

					break;

				//////////////////// MENU OWNER ///////////////////////
				case "kickall":
					if (!isGroupMsg)
						return m.reply(
							from,
							"Maaf, perintah ini hanya dapat dipakai didalam grup!",
							id
						);
					let isOwner = chat.groupMetadata.owner == pengirim || true;
					// log(chat.groupMetadata.owner )
					if (!isOwner)
						return m.reply(
							from,
							"Maaf, perintah ini hanya dapat dipakai oleh owner grup!",
							id
						);
					if (!isBotGroupAdmins)
						return m.reply(
							from,
							"Gagal, silahkan tambahkan bot sebagai admin grup!",
							id
						);
					const allMem = await m.getGroupMembers(groupId);
					try {
						let isAdmins = false;
						for (let i = 0; i < allMem.length; i++) {
							if (groupAdmins.includes(allMem[i].id)) {
								// log(allMem[i])
								isAdmins = true;
							} else {
								isAdmins = false;
								await m.removeParticipant(groupId, allMem[i].id);
							}
						}
						if (!isAdmins) {
							m.reply(from, "Sukses kick semua member", id);
						} else {
							m.reply(from, "Gagal, tidak bisa kick admin", id);
						}
					} catch (error) {
						console.log(color("ERROR", "red"), err);
					}

					break;
				case "ban":
					if (!isOwnerBot)
						return m.reply(from, "Perintah ini hanya untuk Owner bot!", id);
					if (args.length == 0)
						return m.reply(
							from,
							`Untuk banned seseorang agar tidak bisa menggunakan commands\n\nCaranya ketik: \n${prefix}ban add 628xx --untuk mengaktifkan\n${prefix}ban del 628xx --untuk nonaktifkan\n\ncara cepat ban banyak digrup ketik:\n${prefix}ban @tag @tag @tag`,
							id
						);
					try {
						if (args[0] === "add") {
							if (mentionedJidList.length !== 0) {
								for (let benet of mentionedJidList) {
									if (benet === botNumber)
										return await m.reply(from, ind.wrongFormat(), id);
									banned.push(benet);
									fs.writeFileSync(
										"./settings/banned.json",
										JSON.stringify(banned)
									);
								}
								await m.reply(from, "Mampus gua ban lu anjg!", id);
							} else {
								banned.push(args[1] + "@c.us");
								fs.writeFileSync(
									"./settings/banned.json",
									JSON.stringify(banned)
								);
								await m.reply(from, "Mampus gua ban lu anjg!", id);
							}
						} else if (args[0] === "del") {
							if (mentionedJidList.length !== 0) {
								if (mentionedJidList[0] === botNumber)
									return await m.reply(from, ind.wrongFormat(), id);
								banned.splice(mentionedJidList[0], 1);
								fs.writeFileSync(
									"./settings/banned.json",
									JSON.stringify(banned)
								);
								await m.reply(from, "Nih gua udh unbaned!", id);
							} else {
								banned.splice(args[1] + "@c.us", 1);
								fs.writeFileSync(
									"./settings/banned.json",
									JSON.stringify(banned)
								);
								await m.reply(from, "Nih gua udh unbaned!", id);
							}
						} else {
							await m.reply(from, ind.wrongFormat(), id);
						}
					} catch (error) {
						log(color("err", "red"), error);
					}
					break;
				case "bc": //untuk broadcast atau promosi
					try {
						if (!isOwnerBot)
							return m.reply(from, "Perintah ini hanya untuk Owner bot!", id);
						if (isTeks)
							return m.reply(
								from,
								`Untuk broadcast ke semua chat ketik:\n${prefix}bc [isi chat]`,
								id
							);
						let msg = body.slice(4);
						const chatz = await m.getAllChatIds();
						// log(msg)
						for (let idk of chatz) {
							var cvk = await m.getChatById(idk);
							log(idk);
							 if (!cvk.isReadOnly) m.sendText(idk, `${msg}`)
							  if (cvk.isReadOnly) m.sendText(idk, `${msg}`)
							await sleep(1000);
						}
						log(color("[SUCCES]", "green"), "sending broadcast");
						await m.reply(from, "Broadcast Success!", id);
					} catch (error) {
						console.log(error);
					}
					break;
				case "unblock":
					if (isTeks)
						return await m.reply(
							from,
							`ketik ${prefix}unblock <nomor tujuan> \ncontoh: *${prefix}unblock* 628888888`
						);

					try {
						banned.splice(args[0] + "@c.us", 1);
						await m.contactUnblock(args[0] + "@c.us");
						fs.writeFileSync("./settings/banned.json", JSON.stringify(banned));

						await m.reply(from, "done", id);
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}

					break;
				case "addupdate":
					try {
						
						if (!isOwnerBot)
							return m.reply(
								from,
								"Maaf, perintah ini hanya dapat dipakai oleh owner!",
								id
							);
						if (isTeks)
							return m.reply(
								from,
								`berikan keterangan update.\ncontoh *${prefix}addupdate* buat fitur blablabla`,
								id
							);
						const update = body.slice(10);
						// log(update)
						updateBot.push(update);
						// log(updateBot)
						fs.writeFileSync(
							"./settings/update.json",
							JSON.stringify(updateBot, null, 2)
						);
						m.reply(from, `Sukses menambahkan update :)`, id);
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;
				case "update":
					try {
						const updaterr = updateBot;
						let updatee = `╔══✪〘 *List Update* 〙✪══\n`;
						for (let i = 0; i < updaterr.length; i++) {
							updatee += "╠➥";
							updatee += ` ${updaterr[i]}\n`;
						}
						updatee += "╚═〘 *Bot* 〙";
						await m.sendText(from, updatee);
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;
				case "clearupdate":
					try {
						fs.writeFileSync('./settings/update.json', JSON.stringify([], null, 2));
						await m.reply(from, "berhasil hapus list update", id);

					} catch (error) {
						await m.reply(from, error, id);
						logerr(error)
					}
					break;
				case "leaveall": //mengeluarkan bot dari semua group serta menghapus chatnya
					try {
						if (!isOwnerBot)
							return m.reply(from, "Perintah ini hanya untuk Owner bot", id);
						const allChatz = await m.getAllChatIds();
						const allGroupz = await m.getAllGroups();
						// log(allChatz)
						for (let gclist of allGroupz) {
							// log(gclist)
							// await m.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChatz.length}`)
							await m.leaveGroup(gclist.contact.id);
							await m.deleteChat(gclist.contact.id);
						}
						m.reply(from, "Success leave all group!", id);
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;
				case "clearall": //menghapus seluruh pesan diakun bot
					if (!isOwnerBot)
						return m.reply(from, "Perintah ini hanya untuk Owner bot", id);
					const allChatx = await m.getAllChats();
					for (let dchat of allChatx) {
						await m.deleteChat(dchat.id);
					}
					m.reply(from, "Success clear all chat!", id);
					break;

				/////////////////// MENU MEDIA //////////////////
				case "ig":
					if (isTeks)
						return m.reply(
							from,
							`Download vidio dari ig.\n\nContoh:\n${prefix}ig (link instagram) atau\n${prefix}instagram (link instagram)`,
							id
						);
					const options = {
						method: "GET",
						url: "https://social-media-video-downloader.p.rapidapi.com/smvd/get/instagram",
						params: {
							url: teks,
						},
						headers: {
							"x-rapidapi-key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"x-rapidapi-host": "social-media-video-downloader.p.rapidapi.com",
						},
					};
					try {
						const response = await axios.request(options);
						if (response.status != 200) throw new Error();
						if (response.status == 200) {
							await m.reply(from, "sedang diproses 🚀", id);
							// log(response.data)

							await response.data.links.forEach(async (e) => {
								if (e.quality == "video_hd_original_0") {
									await m.sendImage(from, e.link, "results.mp4", "", id);
								}
							});
						}
						// for (var i = 0; i < response.data.links; i++) {
						//   let p = response.data.links[i].quality;
						//   let medias = response.data.links[i].link;
						//   // log(medias);
						//   if (p === "audio_0") {
						//     await m.sendImage(from, medias, _, _, id);
						//   } else {
						//     await m.sendImage(from, medias, _, _, id);
						//   }
						// }
					} catch (err) {
						console.log(color("ERR", "red"), err);
					}
					break;

				case "ytmp3":
					sayMaintenance(from,id);
					break;
				case "ytmp4":
					sayMaintenance(from, id);

					// if (isTeks)
					// 	return m.reply(
					// 		from,
					// 		`Download audio dari yt.\n\nContoh:\n${prefix}ytmp3 (link youtube)`,
					// 		id
					// 	);
					// // log(teks);
					// const ytmp4 = {
					// 	method: "GET",
					// 	url: "https://social-media-video-downloader.p.rapidapi.com/smvd/get/youtube",
					// 	params: {
					// 		url: "https://youtu.be/9kH_p8FhBZI",
					// 	},
					// 	headers: {
					// 		"x-rapidapi-key":
					// 			"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
					// 		"x-rapidapi-host": "social-media-video-downloader.p.rapidapi.com",
					// 	},
					// };
					// try {
					// 	// await m.sendImage(from , "", "vidio.mp4", "", id)
					// 	// const response = await axios.request(ytmp4);
					// 	// // console.log(response.statusCode);
					// 	// if (response.data?.error == true)
					// 	//   throw new Error(response.data?.error_message);
					// 	// if (response.status == 200) m.reply(from, `sedang diproses 🚀`, id);
					// 	// if (response.status != 200) throw new Error();
					// 	// log(response.data.links);
					// 	// await response.data?.links.forEach(async (e) => {
					// 	//   if(e.quality == "video_hd_480p (only_video)"){
					// 	//    await m.sendImage(from, e.link, "d.mp4", "", id);
					// 	//   }
					// 	// })
					// 	// await m.sendAudio(from, response.data.audio_high, id);
					// } catch (error) {
					// 	await m.reply(from, "proses gagal ☠", id);
					// 	console.log(color("ERROR", "red"), error);
					// }

					break;
				case "tkmp4":
					if (isTeks)
						return m.reply(
							from,
							`Download vidio dari tiktok.\n\nUsage:\n${prefix}tkmp4 (link tiktok) `,
							id
						);
					try {
						const urlVid = teks
						
						const axios = require('axios');
						const tiktokApi = {
							method: 'GET',
							url: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/tiktok',
							params: {
							  url: urlVid
							},
							headers: {
							  'x-rapidapi-key': '766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46',
							  'x-rapidapi-host': 'social-media-video-downloader.p.rapidapi.com'
							}
						  };
						   const response = await axios.request(tiktokApi);
						   if (response.status == 200 ) {
								// response.data.video
								const video = response.data.links[0];
								const quality = response.data.links[0];
								await m.reply(from, "sedang diproses 🚀", id);


								if(quality.quality !== "audio"){
									await m.sendFileFromUrl(from,video.link, "results.mp4","",id );
									log("sukses");
								}
								

							} else {
									m.reply(from,`gagal mendownload\ncoba lagi nanti`,id);
								};
								
					} catch (error) {
						await m.reply(from, "maaf ada yang error", id)				
						logerr(error);
					}
					break;
				case "tkmp3":
					if (isTeks)
					return m.reply(
						from,
						`Download lagu/sound dari tiktok.\n\nUsage:\n${prefix}tkmp3 (link tiktok) `,
						id
					);
					try {
					
						const axios = require('axios');
						const tiktokApi = {
							method: 'GET',
							url: 'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/index',
							params: {
							  url: teks
							},
							headers: {
							  'X-RapidAPI-Key': '766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46',
							  'X-RapidAPI-Host': 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com'
							}
						  };
						   const response = await axios.request(tiktokApi);
						   if (response.status == 200 ) {
									// response.data.video
									await m.reply(from, "sedang diproses 🚀", id);

									
									// log(response.data.video[0])

									await m.sendAudio(from,response.data.music[0],id );

							} else {
									m.reply(from,`gagal mendownload\ncoba lagi nanti`,id);
								};


					} catch (error) {
						logerr(error)
					}
					break

				case "fb":
					if (isTeks)
						return m.reply(
							from,
							`Download vidio dari fb.\n\nContoh:\n${prefix}fb (link vidio)`,
							id
						);
					const fb = {
						method: "GET",
						url: "https://social-media-video-downloader.p.rapidapi.com/smvd/get/facebook",
						params: {
							url: teks,
						},
						headers: {
							"x-rapidapi-key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"x-rapidapi-host": "social-media-video-downloader.p.rapidapi.com",
						},
					};
					try {
						const response = await axios.request(fb);
						if (response.data?.error == true)
							throw new Error(response.data?.error_message);
						if (response.status == 200) m.reply(from, `sedang diproses 🚀`, id);
						if (response.status != 200) throw new Error();

						await response.data?.links.map(async (e, i) => {
							if (e.quality == "video_hd_0") {
								await m.sendImage(from, e.link, "fb_hd.mp4", "", id);
								return;
							}
						});
					} catch (err) {
						console.log(error("ERROR", "red"), err);
					}

					break;
				case "sticker":
				case "stiker":
					// if (isMedia && isImage || isQuotedImage) {
						const encryptMedia = isQuotedImage ? quotedMsg : message

						let buffer = await decryptMedia(encryptMedia);
						buffer = await writeExifImg(buffer, {
							packname: "🚀",
							author: "🚀",
						  });

						
						try {
							await m.sendImageAsSticker(from , buffer)
							fs.unlinkSync(buffer);

						} catch (error) {
							await m.reply(from , "maaf ada yang error", id);
							logerr(error)
						}
					// }

					// try {
					// 	if (mimetype) {
					// 		const mediaData = await decryptMedia(message);
					// 		// log(mediaData);
					// 		await m.sendImageAsSticker(from, mediaData, {
					// 			packname: "🚀",
					// 			author: "🚀",
					// 		});
					// 	}
					// } catch (error) {
					// 	await m.reply(from , error.data, id);
					// 	console.log(color("ERR", "red"), error);
					// }
					break;

				case "speech":
					const spechId = {
						method: "GET",
						url: "https://text-to-speech27.p.rapidapi.com/speech",
						params: {
							text: teks,
							lang: "id",
						},
						headers: {
							"X-RapidAPI-Key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"X-RapidAPI-Host": "text-to-speech27.p.rapidapi.com",
						},
					};

					const response = await axios.request(spechId);
					// log(response)
					await m.sendPtt(from, response.data);

					break;

				////////////////////////// MENU USER ///////////////////////////////
				case "reqfitur":
					if (args.length == 0)
						return m.reply(
							from,
							`[❗] Kirim perintah *${prefix}reqfitur [teks]*\ncontoh : *${prefix}reqfitur bang req fitur blablabla*`,
							id
						);
					const fitur = body.slice(11);
					m.sendText(
						ownerNumber,
						`*[REQUEST FITUR]*\n*WAKTU* : ${time}\nNO PENGIRIM : wa.me/${sender.id.match(
							/\d+/g
						)}\nGroup : ${formattedTitle}\n\n${fitur}`
					);
					m.reply(from, "Request fitur berhasil dikirim 🚀", id);
					break;
				case "reportbug":
					if (args.length == 0)
						return m.reply(
							from,
							`[❗] Kirim perintah *${prefix}reportbug [teks]*\ncontoh : *${prefix}reportbug ada bug di menu .add ,tolong diperbaikin*`,
							id
						);
					const bugs = body.slice(11);
					m.sendText(
						ownerNumber,
						`*[BUG REPORT]*\n*WAKTU* : ${time}\nNO PENGIRIM : wa.me/${sender.id.match(
							/\d+/g
						)}\nGroup : ${formattedTitle}\n\n${bugs}`
					);
					m.reply(from, "Report bug berhasil dikirim 🚀", id);
					break;
				case "free":
					const current = {
						method: "GET",
						url: "https://epic-free-games.p.rapidapi.com/epic-free-games",
						headers: {
							"X-RapidAPI-Key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"X-RapidAPI-Host": "epic-free-games.p.rapidapi.com",
						},
					};
					try {
						const response = await axios.request(current);
						if (response.status != 200) {
							console.log(
								"error code : ",
								response.status,
								" ",
								response.statusText
							);
							m.reply(from, `eror code : ${response.status}`, id);
						} else {
							if (response.data == "") {
								await removeEmote(mek.key);
								return m.reply(from, "Tidak ada game gratis sekarang", id);
							}
							for (let i = 0; i < response.data.length; i++) {
								let nama = response.data[i].name;
								let image = response.data[i].offerImageTall;
								let url = response.data[i].appUrl;
								let description = response.data[i].description;
								let publisher = response.data[i].publisher;
								let oriPrice = response.data[i].originalPrice;
								let ket = `*${nama}*\n\nOpen In : ${url}\n\n*Price : free*\nNormal Price : ${oriPrice}\n\nDescription : ${description}\n\nPublisher : ${publisher}`;

								await m.sendImage(from, image, "res.jpeg", ket, id);
							}
						}
					} catch (err) {
						console.log(color("ERR", "red"), err);
						await m.reply(from, "maaf sepertinya ada yang error", id);
					}

					break;
				case "up":
					const upcoming = {
						method: "GET",
						url: "https://epic-free-games.p.rapidapi.com/epic-free-games-coming-soon",
						headers: {
							"X-RapidAPI-Key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"X-RapidAPI-Host": "epic-free-games.p.rapidapi.com",
						},
					};
					try {
						const response = await axios.request(upcoming);
						if (response.status != 200) {
							console.log(
								"eror code : ",
								response.status,
								" ",
								response.statusText
							);
							m.reply(from, `eror code : ${response.status}`, id);
						} else {
							if (response.data == "") {
								await removeEmote(mek.key);
								return m.reply("tidak ada game gratis nanti");
							}
						}
						for (let i = 0; i < response.data.length; i++) {
							let nama = response.data[i].name;
							let image = response.data[i].offerImageTall;
							let url = response.data[i].appUrl;
							let description = response.data[i].description;
							let publisher = response.data[i].publisher;
							let ket = `*${nama}* (coming soon)\n\nOpen In : ${url}\n\nDescription : ${description}\n\nPublisher : ${publisher}`;

							await m.sendImage(from, image, "upcoming.jpeg", ket, id);
						}
					} catch (error) {
						console.log(color("err", "red"), error);
						await m.reply(from, "maaf sepertinya ada yang error", id);
					}

					break;
				case "join":
					if (args.length == 0)
						return m.reply(
							from,
							`Jika kalian ingin mengundang bot kegroup silahkan invite atau dengan\nketik ${prefix}join [link group]`,
							id
						);
					let linkgrup = body.slice(6);
					let islink = linkgrup.match(/(https:\/\/chat.whatsapp.com)/gi);
					// log(linkgrup)
					let chekgrup = await m.inviteInfo(linkgrup);
					if (!islink)
						return m.reply(
							from,
							"Maaf link group-nya salah! silahkan kirim link yang benar",
							id
						);
					try {
						if (isOwnerBot) {
							await m.joinGroupViaLink(linkgrup).then(async () => {
								await m.sendText(from, "Berhasil join grup via link!");
								await m.sendText(
									chekgrup.id,
									`Hi all~, Im mbot. Untuk Memulai Bot silahkan ketik  ${prefix}menu`
								);
							});
						} else {
							let cgrup = await m.getAllGroups();
							if (cgrup.length > groupLimit)
								return m.reply(
									from,
									`Sorry, the group on this bot is full\nMax Group is: ${groupLimit}`,
									id
								);
							await m.sendContact(from, ownerNumber);
							if (cgrup.size < memberLimit)
								return m.reply(
									from,
									`Apanih member dikit bat ${memberLimit} orang`,
									id
								);
							await m
								.joinGroupViaLink(linkgrup)
								.then(async (e) => {
									console.log(e);
									await m.reply(from, "Berhasil join grup via link!", id);
								})
								.catch(() => {
									m.reply(from, "Gagal!", id);
								});
						}
					} catch (error) {
						await m.reply(from, "Error", id);
						console.log(color("ERR", "red"), error);
					}
					break;
				case "botstat":
					try {
						const loadedMsg = await m.getAmountOfLoadedMessages();
						const chatIds = await m.getAllChatIds();
						const groups = await m.getAllGroups();
						m.sendText(
							from,
							`Status :\n- *${loadedMsg}* Loaded Messages\n- *${
								groups.length
							}* Group Chats\n- *${
								chatIds.length - groups.length
							}* Personal Chats\n- *${chatIds.length}* Total Chats`
						);
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;
				case "ping":
					await m.sendText(
						from,
						`Pong!!!!\nSpeed: ${processTime(t, moment())} _Second_`
					);
					break;
				case "creategroup":
					if (isTeks) return await m.reply(from, "w", id);

					try {
						log(botNumber, sender.id);

						const gcname = teks;
						await m
							.createGroup(gcname, "6282353585277@c.us")
							.then(async (e) => {
								log("err", e);
								await m.sendText(from, `Sukses membuat grup`, id);
							});

						// log(gcname)

						// await m.reply(from, `berhasil membuat group ${teks}`, id)
					} catch (error) {
						log(error);
					}
					break;
				case "mystat":
						const userid = sender.id;
						const ban = banned.includes(userid);
						const blocked = await m.getBlockedIds();
						const isblocked = blocked.includes(userid);
						const ct = await m.getContact(userid);
						const isOnline = (await m.isChatOnline(userid)) ? "✔" : "❌";
						var sts = await m.getStatus(userid);
						const bio = sts;
						const admins = groupAdmins?.includes(userid) ? "Admin" : "Member";
						var found = false;
						Object.keys(pengirim).forEach((i) => {
							if (pengirim[i].id == userid) {
								found = i;
							}
						});
						var adm = admins;
						try {
							if (ct == null) {
								return await m.reply(
									from,
									"Nomor WhatsApp tidak valid [ Tidak terdaftar di WhatsApp ]",
									id
								);
							} else {
								const contact = ct.pushname;
								const dp = await m.getProfilePicFromServer(userid);
								let pfp =  dp == undefined || dp == 'ERROR: 404'|| dp == 'ERROR: 401' ? errorImgg : dp;

								// if (dp == undefined) {
								// 	pfp = errorImgg;
								// }
								if (contact == undefined) {
									var nama = "_MR. No name_";
								} else {
									var nama = contact;
								}
								const caption = `*Detail Member* ✨ \n\n● *Name :* ${nama}\n● *Bio :* ${
									bio.status
								}\n● *Chat link :* wa.me/${sender.id.replace(
									"@c.us",
									""
								)}\n● *Role :* ${adm}\n● *Banned by Bot :* ${
									ban ? "✔" : "❌"
								}\n● *Blocked by Bot :* ${
									isblocked ? "✔" : "❌"
								}\n● *Chat with bot :* ${isOnline} ${
									ban || isblocked
										? `\n\n _you are blocked?_chat the owner_ try:*${prefix}owner* `
										: ""
								}`;
								// log(pfp);
								m.sendFileFromUrl(from, pfp, "dp.jpg", caption);
							}
						} catch (error) {
							console.log(color("ERROR", "red"), error);
						}
					
					break;
				case "owner":
					try {
						await m.reply(
							from,
							`Owner : wa.me/${ownerNumber.replace("@c.us", "")}`,
							id
						);
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;

				case "p":
					await m.sendText(from, "ini pesan akan hilang dalam 24 jam", {
						disappearingMessagesInChat: 86400,
					});
					break;

				///////////////////// MENU HIBURAN ////////////////////////
				case "cekhodam":
				case "cekkhodam":
					if (isTeks)
						return await m.reply(
							from,
							`cek khodam kamu dengan cara *${prefix}cekkhodam [namakamu]*\ncontoh: *${prefix}cekkhodam ujang*`,
							id
						);
					try {
						const khodammu = fun.cekKhodam();
						await m.reply(from, `*Nama: ${teks}*\n*Khodam: ${khodammu}*`, id);
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;

				case "spotifysearch":
					if (isTeks)
						return await m.reply(
							from,
							`cari track song di spotify dengan cara *${prefix}spotify [keyword]*\ncontoh: *${prefix}spotify evaluasi*`,
							id
						);
					try {
						// log(teks)
						fun
							.spotifySearch(teks)
							.then(async (res) => {
								// log(res)
								const caption = `🏷 : ${res.name}\n🔗 : ${res.shareUrl}\n⌛ : ${res.duration}`;
								await m.sendImage(
									from,
									res.coverUrl,
									"results.png",
									caption,
									id
								);
							})
							.catch(async (err) => {
								await m.reply(from, "gagal", id);
								console.log(color("ERROR", "red"), err);
							});
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;
				case "linkedln":
					if (isTeks)
						return await m.reply(
							from,
							`cari Job di Linkedln dengan cara *${prefix}linkedln [job-search] [kuantitas]*\ncontoh: *${prefix}linkedln fullstack-dev 5* \n*WAJIB PAKEK STRIP (-)  `,
							id
						);
					try {
						const jobQ = args[0].split("-").join(" ");
						log(jobQ);
						const quantity = args[1];
						if (isNaN(quantity))
							return await m.reply(
								from,
								`parameter kedua harus berupa angka!!\ncontoh: *${prefix}linkedln fullstack-dev 5* \n*WAJIB PAKEK STRIP (-)`,
								id
							);
						await m.reply(from, `mencari job ${jobQ} ~~`, id);
						fun
							.linkedln(jobQ, quantity)
							.then(async (res) => {
								// log(res)
								res.map(async (e) => {
									const desc = truncateText(e.jobdesc, 250);
									const text = `*Title* : ${e.title}\n*Company* : ${e.companyName}\n*location* : ${e.location}\n*Industries* : ${e.industries}\n*Url* : ${e.url}\n*JobDesc* : ${desc}`;
									await m.sendText(from, text);
									// log(desc);
								});
							})
							.catch((err) => {
								console.log(color("ERROR", "red"), err);
							});
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}

					break;
				case "pantun":
					try {
						await m.reply(from, fun.getPantun(), id);
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;
				case "fakta":
					try {
						fetch(
							"https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt"
						)
							.then((res) => res.text())
							.then((body) => {
								let splitnix = body.split("\n");
								let randomnix =
									splitnix[Math.floor(Math.random() * splitnix.length)];
								m.reply(from, randomnix, id);
							})
							.catch(() => {
								m.reply(from, "Ada yang Error!", id);
							});
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;
				case "katabijak":
					fetch(
						"https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt"
					)
						.then((res) => res.text())
						.then((body) => {
							let splitbijak = body.split("\n");
							let randombijak =
								splitbijak[Math.floor(Math.random() * splitbijak.length)];
							m.reply(from, randombijak, id);
						})
						.catch(() => {
							m.reply(from, "Ada yang Error!", id);
						});
					break;
				case "cekresi":
					if (isTeks)
						return await m.reply(
							from,
							`lacak paket mu dengan resi..\nusage : *${prefix}cekresi [kurir] [nomor resi]*\ncontoh: *${prefix}cekresi jnt 582230008329223*\n\nuntuk lihat daftar kurir yang tersedia bisa ketik *${prefix}kurir*`,
							id
						);
					const kurir = args[0].toLowerCase();
					const resi = args[1];
					if (filetype.courier[kurir] !== undefined && !isNaN(resi)) {
						log(kurir, resi);
						fun
							.cekResi(resi, kurir)
							.then(async (res) => {
								// log(res)
								const courier = res.summary.courier ? res.summary.courier : "";
								const status = res.summary.status ? res.summary.status : "";
								const date = res.summary.date;
								const origin = res.detail.origin;
								const destination = res.detail.destination;
								let historye = "*[HISTORY]*\n";
								res.history.map((item, i) => {
									historye += `${item.date}\n${item.desc}\n\n`;
								});
								const results = `*[DETAIL]*\nkurir : ${courier}\nStatus : ${status}\nWaktu : ${date}\nDari : ${origin}\nKe : ${destination}\n\n${historye}`;

								await m.reply(from, results, id);
							})
							.catch((err) => {
								log(err);
							});
					} else {
						await m.reply(from, "format salah", id);
					}
					break;
				case "kurir":
					try {
						let tekes = "";
						for (const [key] of Object.entries(filetype.courier)) {
							tekes += `${key}\n`;
						}
						await m.reply(from, tekes, id);
					} catch (error) {}
					break;
				case "translate":
					sayMaintenance(from, id);

					break;
				case "artinama":
					sayMaintenance(from, id);
					break;
				case "igs":
					sayMaintenance(from, id);

					break;
				
				////////////// ISLAM COMMAND //////////
				case 'listsurah':
                    try {
                        axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                            .then((response) => {
                                let hehex = '╔══✪〘 List Surah 〙✪══\n'
                                for (let i = 0; i < response.data.data.length; i++) {
                                    hehex += '╠➥ '
                                    hehex += response.data.data[i].name.transliteration.id.toLowerCase() + '\n'
                                }
                                hehex += '╚══════════'
                                m.reply(from, hehex, id)
                            })
                    } catch (err) {
                        m.reply(from, err, id)
						logerr(errr);
                    }
                    break
				case "Alaudio":
					sayMaintenance(from, id);

					break;
				case "tafsir":
					if(args.length == 0) return await m.reply(from , `*_${prefix}tafsir <nama surah> <ayat>_*\nMenampilkan ayat Al-Quran tertentu beserta terjemahan dan tafsirnya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}tafsir al-baqarah 1`, id);
					try {
						var responseh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
						var { data } = responseh.data
						var idx = data.findIndex(function (post, index) {
							if ((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase()) || (post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
								return true;
						});
						if(idx < 0) return await m.reply(from, `sepertinya format penulisan surah tidak sesuai! coba lihat di *${prefix}listsurah*`, id);
						// log(idx)
						nmr = data[idx].number
						if (!isNaN(nmr)) {
							var responseh2 = await axios.get("https://raw.githubusercontent.com/rioastamal/quran-json/master/surah/" + nmr + ".json")
							var { data } = responseh2
							data= data[nmr];
							const namaLatin = data.name_latin;

							const ayatLength = data.number_of_ayah;
							let tafsir = `_Tafsir surah ${namaLatin} ayat ${args[1]}_\n`;
							for(let i =1 ; i <= ayatLength; i++){
								if( i == args[1]){
									tafsir += `${data.tafsir.id.kemenag.text[i]}\n`
								}else if(i > ayatLength  &&  args[1] > ayatLength || args[1] <= 0){
									// log(i, ayatLength, args[1])
									return await m.reply(from, 'ayat yang anda masukkan tidak sesuai', id)

								}
							}
							// log(args[1]);

							await m.reply(from, tafsir, id);
						}
					} catch (error) {
						await m.reply(from , "maaf ada yang error", id);
						logerr(error)
					}


					break;
				case 'surah':
						if (args.length == 0) return m.reply(from, `* ${prefix}surah <nama surah> *\nMenampilkan ayat Al-Quran tertentu beserta terjemahannya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}surah al-baqarah\n **pastikan nama surah harus sesuai dengan yang ada di _${prefix}listsurah_* `, message.id)
						try {
							
						var responseh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
						var { data } = responseh.data
						var idx = data.findIndex(function (post, index) {
							if ((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase()) || (post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
								return true;
						});
						if(idx < 0) return await m.reply(from, `sepertinya format penulisan surah tidak sesuai! coba lihat di *${prefix}listsurah*`, id);
						// log(idx)
						nmr = data[idx].number
						if (!isNaN(nmr)) {
							var responseh2 = await axios.get("https://raw.githubusercontent.com/rioastamal/quran-json/master/surah/" + nmr + ".json")
							var { data } = responseh2
							data= data[nmr];
							const namaLatin = data.name_latin;
							const namaAr = data.name;
							const ayatLength = data.number_of_ayah;
							const judulTerjemahan = data.translations.id.name;
							let textAyat = '';
							let terjemahan =`_Terjemahan_ \n ════〘 ${judulTerjemahan} 〙════\n`;
							for(let i =1 ; i <= ayatLength; i++){
								textAyat += `\n${data.text[i]}〘${i}〙`
								terjemahan += `〘${i}〙 ${data.translations.id.text[i]}\n`
							}
							// log(terjemahan)
							let pesan= `════〘 _${namaLatin}_/${namaAr} 〙════\n`;
							
							pesan += textAyat
							
							pesan += "\n\n(Q.S. " + namaLatin + ")"
							await m.reply(from, pesan, id)
							await m.reply(from, terjemahan, id);
						}
						
						} catch (error) {
							await m.reply(from , "maaf ada yang error", id);
							logerr(error)
						}
						break
				case 'infosurah':
					if (args.length == 0) return m.reply(from, `*_${prefix}infosurah <nama surah>_*\nMenampilkan informasi lengkap mengenai surah tertentu. Contoh penggunan: ${prefix}infosurah al-baqarah`, message.id)
					try {
							
						var responseh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
						var { data } = responseh.data
						var idx = data.findIndex(function (post, index) {
							if ((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase()) || (post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
								return true;
						});
						if(idx < 0) return await m.reply(from, `sepertinya format penulisan surah tidak sesuai! coba lihat di *${prefix}listsurah*`, id);

						var pesan = ""
						pesan = pesan + "Nama : " + data[idx].name.transliteration.id + "\n" + "Asma : " + data[idx].name.short + "\n" + "Arti : " + data[idx].name.translation.id + "\n" + "Jumlah ayat : " + data[idx].numberOfVerses + "\n" + "Nomor surah : " + data[idx].number + "\n" + "Jenis : " + data[idx].revelation.id + "\n" + "Keterangan : " + data[idx].tafsir.id
						await m.reply(from, pesan, message.id)
					
					} catch (error) {
						await m.reply(from , "maaf ada yang error", id);
						logerr(error)		
					}
					break
				case "wiki":
					sayMaintenance(from, id);

					break;
				
				default:
					m.reply(from, "saat ini menu belum tersedia", id);
					break;
			}
		}
	} catch (error) {
		console.log(color("[EROR]", "red"), error);
	}
};
