const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta").locale("id");
const fs = require("fs-extra");
const axios = require("axios");
const { color } = require("./utils");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { decryptMedia } = require('@open-wa/wa-automate');
const mime = require('mime-types');
const fss = require('fs');
const path = require("path");

////////////////////MENU///////////////////////////
const {
    menu,
    filetype,
    convert

} = require("./lib");
const { log } = require("console");

//////////////////////////////FOLDER SYSTEM///////////////////////////////////
const setting = JSON.parse(fs.readFileSync("./settings/setting.json"));
const banned = JSON.parse(fs.readFileSync("./settings/banned.json"));
const key = JSON.parse(fs.readFileSync("./settings/key.json"));


let { ownerNumber, groupLimit, limitCount, memberLimit, prefix } = setting;

module.exports = message = async (m, message, startTime) => {
	try {
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
		var { items, name, formattedTitle } = chat;
		let { text } = message;
		let { pushname, verifiedName, formattedName } = sender;
		const botNumber = (await m.getHostNumber()) + "@c.us";
		const groupId = isGroupMsg ? chat.groupMetadata.id : "";
		const groupAdmins = isGroupMsg ? await m.getGroupAdmins(groupId) : "";
		const groupMembers = isGroupMsg ? await m.getGroupMembersId(groupId) : "";
		// const isOwner = sender.id === ownerNumber.includes
		const isGroupAdmins = groupAdmins.includes(sender.id) || false;
		const chats =
			type === "chat"
				? body
				: type === "image" || type === "video"
				? caption
				: "";
		const pengirim = sender.id;
		const time = moment(t * 1000).format("DD/MM/YY HH:mm:ss");

		// Bot Prefix
		body =
			type === "chat" && body.startsWith(prefix)
				? body
				: (type === "image" || type === "video" || type === "document") &&
				  caption &&
				  caption.startsWith(prefix)
				? caption
				: "";
		const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
		const commandd = caption || body || "";
		const arg = body.substring(body.indexOf(" ") + 1);
		const validMessage = caption ? caption : body;
		const arguments = validMessage.trim().split(" ").slice(1);
		const args = body.trim().split(/ +/).slice(1);
		const argv = body.slice(1).trim().split(/ +/).shift().toLowerCase();
		const isCmd = body.startsWith(prefix);
		const argus = commandd.split(" ");
		const teks = args.join(" ");

		const isTeks = args.length == 0 ? true : false;
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

		//   console.log(truncatedText); // Output: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."

		// [IDENTIFY]
		const isOwnerBot = ownerNumber.includes(pengirim);
		const isBanned = banned.includes(pengirim);

		// Log
        // console.log(message);

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

		// console.log(quotedMsg);
        // console.log(type);
		if (isCmd) {
			switch (command) {
				case "b":
				case "bard":
					try {
						if (isTeks)
							return m.reply(
								from,
								`Chat dengan gemini AI\n\nContoh:\n${prefix}${command} Siapa penemu mesin deisel`,
								id
							);
						const genAI = new GoogleGenerativeAI(key.gemini);
						const model = genAI.getGenerativeModel({ model: "gemini-pro" });

						let prompt =
							quotedMsg !== undefined
								? quotedMsg.text + ". ( prompt : " + teks + ")"
								: teks;
						// console.log(prompt, key.gemini);
						const result = await model.generateContent(prompt);
						const response = result.response;
						// console.log(response.promptFeedback);

						const res = response.text();
						await m.reply(from, res, id);
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

				case "tkmp4":
					if (isTeks)
						return m.reply(
							from,
							`Download Video from tiktok No watermak.\n\nContoh:\n${prefix}tkmp4 (link vidio tiktok) `,
							id
						);

					try {
						const tiktokApi = {
							method: "GET",
							url: "https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/index",
							params: {
								url: teks,
							},
							headers: {
								"X-RapidAPI-Key":
									"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
								"X-RapidAPI-Host":
									"tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com",
							},
						};
						const response = await axios.request(tiktokApi);
						if (response.status == 200) {
							await client.sendMessage(mek.key.remoteJid, {
								video: { url: response.data.video },
							});
						} else {
							m.reply(from, `gagal mendownload\ncoba lagi nanti`, id);
						}
					} catch (error) {
						console.log(color("ERROR", "red"), error);
					}
					break;


                case "wordpdf":
                    // console.log(mimetype);
                    try {
                    if(mimetype){
                        const filename = `${t}.${mime.extension(mimetype)}`;
                        const mediaData = await decryptMedia(message);
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString(
                          'base64'
                        )}`;
                        // await m.sendImage(
                        //     from,
                        //     imageBase64,
                        //     filename,
                        //     `You just sent me this ${type}`
                        //   );

                        await m.reply(from, 'tunggu sebentar ~', id);

                   
                        fss.writeFile(filename, mediaData, async(err) => {
                            if (err)  return console.log(err);


                            console.log('The file was saved!');
                            await convert( filetype.importAndExport.pdf , filename)
                            .then(async(res) => {
                                if(res.success){
                                    const pdffile = await fss.readFileSync('./temp/results.pdf', {encoding : 'base64'});
                                    await m.sendImage(
                                        from,
                                        `data:pdf;base64,${pdffile.toString('base64')}`,
                                        'results.pdf',
                                        `ini bang file pdf nya`
                                        );
        
                                    await fss.unlink(path.join(__dirname, filename), (err) => {
                                        if (err) {
                                            console.log(color("ERROR", "red"), `Gagal menghapus file : ${err}`)
                                        } else {
                                            console.log(`File  berhasil dihapus`)
                                        }
                                    })
                                    
                                   
                                    await fss.unlink(path.join(__dirname ,"/temp/", "results.pdf"), (err) => {
                                        if (err) { console.log(color("ERROR", "red"), `Gagal menghapus file : ${err}`)
                                        } else {
                                            console.log(`File berhasil dihapus`)
                                        }
                                    })
        
                                } else if (res.success === false) {
                                    await m.reply(from, `Gagal di proses: ${res.message}`, id);
                                } else {
                                    await m.reply(from, 'Gagal di proses, terdapat kesalahan yang tidak diketahui', id);
                                }

                                fss.unlink(path.join(__dirname, filename), (err) => {
                                    if (err) {
                                        console.log(color("ERROR", "red"), `Gagal menghapus file : ${err}`)
                                    } else {
                                        console.log(`File  berhasil dihapus`)
                                    }
                                })
                            })
                            
                          
                            
                        });

                      
                        
                    }
                    
                    } catch (error) {
                        console.log(color("ERROR", 'red'), error);      
                    }

                    break;
				
                case "pdfword":
                    try {
                        if(mimetype){
                            const filename = `${t}.${mime.extension(mimetype)}`;
                            const mediaData = await decryptMedia(message);
                            const imageBase64 = `data:${mimetype};base64,${mediaData.toString(
                              'base64'
                            )}`;
                            // await m.sendImage(
                            //     from,
                            //     imageBase64,
                            //     filename,
                            //     `You just sent me this ${type}`
                            //   );
    
                            await m.reply(from, 'tunggu sebentar ~', id);
    
                       
                            fss.writeFile(filename, mediaData, async(err) => {
                                if (err)  return console.log(err);
    
    
                                console.log('The file was saved!');
                                await convert( filetype.importAndExport.docx , filename)
                                .then(async(res) => {
                                    if(res.success){
                                        const pdffile = await fss.readFileSync('./temp/results.docx', {encoding : 'base64'});
                                        await m.sendImage(
                                            from,
                                            `data:pdf;base64,${pdffile.toString('base64')}`,
                                            'results.docx',
                                            `ini bang file docx nya`
                                            );
            
                                        
                                        
                                       
                                        await fss.unlink(path.join(__dirname ,"/temp/", "results.docx"), (err) => {
                                            if (err) { console.log(color("ERROR", "red"), `Gagal menghapus file : ${err}`)
                                            } else {
                                                console.log(`File berhasil dihapus`)
                                            }
                                        })
            
                                    } else if (res.success === false) {
                                        await m.reply(from, `Gagal di proses: ${res.message}`, id);
                                    } else {
                                        await m.reply(from, 'Gagal di proses, terdapat kesalahan yang tidak diketahui', id);
                                    }

                                    fss.unlink(path.join(__dirname, filename), (err) => {
                                        if (err) {
                                            console.log(color("ERROR", "red"), `Gagal menghapus file : ${err}`)
                                        } else {
                                            console.log(`File  berhasil dihapus`)
                                        }
                                    })
            
                                })
                                
                                
                                
                            });
                            
                            
                        } 

                    } catch (error) {
                        console.log(color("ERROR", 'red') ,error)
                    }
                    break;

                ///////////////////////////////////// MENU //////////////////////////////////////
				case "info":
					const endTime = calcRuntime();
					await m.sendText(from, menu.textMenu(pushname, endTime));
					break;

				case "menuadmin":
					break;

				/////////////////////////////////// MENU ADMIN GRUP //////////////////////////////////

				case "add":
					break;
				case "kick":
					break;
				case "promote":
					break;

				case "demote":
					break;

				case "tagall":
					break;

				case "del":
					break;

				default:
					console.log("menu tidak ada");

					break;
			}
		}
	} catch (error) {
		console.log(color("[EROR]", "red"), error);
	}
};
