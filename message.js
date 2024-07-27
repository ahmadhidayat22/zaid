const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta").locale("id");
const fs = require("fs-extra");
const axios = require("axios");
const { color } = require("./utils");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { decryptMedia } = require("@open-wa/wa-automate");
const mime = require("mime-types");
const fss = require("fs");
const path = require("path");

////////////////////MENU///////////////////////////
const { menu, filetype, convert } = require("./lib");
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
    const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;

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

    ///// all function /////
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
          0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41,
          0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
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

        ///////////////////////////////////// MENU //////////////////////////////////////
        case "info":
          const endTime = calcRuntime();
          await m.sendText(from, menu.info(pushname, endTime));
          break;

        case "menuadmin":
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
            await m
              .addParticipant(from, `${args[0]}@c.us`)
              .then(() => m.reply(from, "Hai selamat datang", id));
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
            return await piyo.reply(
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
            return piyo.reply(
              from,
              "Gagal, perintah ini hanya dapat digunakan oleh admin grup!",
              id
            );
          if (!quotedMsg)
            return piyo.reply(
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

        ////// owner grup /////
        case "kickall":
          if (!isGroupMsg)
            return m.reply(
              from,
              "Maaf, perintah ini hanya dapat dipakai didalam grup!",
              id
            );
          let isOwner = chat.groupMetadata.owner == pengirim;
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
            for (let i = 0; i < allMem.length; i++) {
              if (groupAdmins.includes(allMem[i].id)) {
              } else {
                await m.removeParticipant(groupId, allMem[i].id);
              }
            }
            m.reply(from, "Success kick all member", id);
          } catch (error) {
            console.log(color("ERROR", "red"), err);
          }

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
            url: "https://instagram-api32.p.rapidapi.com/",
            params: {
              url: teks,
            },
            headers: {
              "X-RapidAPI-Key":
                "766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
              "X-RapidAPI-Host": "instagram-api32.p.rapidapi.com",
            },
          };
          try {
            const response = await axios.request(options);
            if (response.status != 200) throw new Error();
            if (response.status == 200);

            for (var i = 0; i < response.data.total_count; i++) {
              let p = response.data.medias[i].extension;
              let medias = response.data.medias[i].url;
              // log(medias);
              if (p === "jpg") {
                await m.sendImage(from, medias, _, _, id);
              } else {
                await m.sendImage(from, medias, _, _, id);
              }
            }
          } catch (err) {
            console.log(color("ERR", "red"), err);
          }
          break;

        case "ytmp3":
          if (isTeks)
            return m.reply(
              from,
              `Download audio dari yt.\n\nContoh:\n${prefix}ytmp3 (link youtube)`,
              id
            );
          log(teks);
          const ytmp3 = {
            method: "GET",
            url: "https://youtube-audio-video-download.p.rapidapi.com/geturl",
            params: {
              video_url: teks,
            },
            headers: {
              "X-RapidAPI-Key":
                "766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
              "X-RapidAPI-Host": "youtube-audio-video-download.p.rapidapi.com",
            },
          };
          try {
            const response = await axios.request(ytmp3);
            // console.log(response.statusCode);
            if (response.data?.error == true)
              throw new Error(response.data?.error_message);
            if (response.status == 200) m.reply(from, `sedang diproses 🚀`, id);
            if (response.status != 200) throw new Error();

            await m.sendAudio(from, response.data.audio_high, id);
          } catch (error) {
            await m.reply(from, "proses gagal ☠", id);
            console.log(color("ERROR", "red"), error);
          }
          break;
        case "ytmp4":
          break;
        case "tkmp3":
          break;
        case "tkmp4":
          break;

        case "stiker":
          try {
            if (mimetype) {
              const mediaData = await decryptMedia(message);
              // log(mediaData);
              await m.sendImageAsSticker(from, mediaData, {
                packname: "🚀",
                author: "🚀",
              });
            }
          } catch (error) {
            console.log(color("ERR", "red"), error);
          }
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
			await m.sendPtt(from, response.data)

			break;
        //////// MENU USER ///////
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

        default:
          m.reply(from, "saat ini menu belum tersedia", id);
          console.log("menu tidak ada");

          break;
      }
    }
  } catch (error) {
    console.log(color("[EROR]", "red"), error);
  }
};
