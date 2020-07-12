const Discord = require("discord.js");
const { Client, Util } = require("discord.js");
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const { Canvas } = require("canvas-constructor");
const { resolve, join } = require("path");
const { get } = require("snekfetch");
const fs = require("fs");
const superagent = require("superagent");
const dotenv = require("dotenv").config();
require("./server.js");

const TOKEN = "NzI0ODM5MDg2MDY5Nzc2Mzk0.XvIBLg.QN4ypE9o0Iqy5v_evLd_FMxDoNY";
const PREFIX = "!!";
const GOOGLE_API_KEY = "AIzaSyCfLoZ9Gf04z3Dv96s_qoi15RFz37S6gRc";

const bot = new Client({
    disableEveryone: true
});

const youtube = new YouTube(GOOGLE_API_KEY);
const queue = new Map();

bot.on("warn", console.warn);
bot.on("error", console.error);
bot.on('ready', () => {
  console.log('saya siap digunakan');
  bot.user.setActivity("Member Sykinyankuツ", {type: "WATCHING"});
});

bot.on("disconnect", () => console.log("An error occurred, trying to reconnect!"));
bot.on("reconnecting", () => console.log("I am reconnecting now..."));



bot.on("message", async msg => { // eslint-disable-line
  
    if (msg.content === "Halo") 
    msg.channel.send("Hello Word")  
  
    if (msg.content === "P") 
    msg.channel.send("Salam Yang Bener Dong, Asw!!") 
   
    if (msg.content === "kok sepi") 
    msg.channel.send("Mana gw Tau, Tolol!!") 
  
    if (msg.content === "ura") 
    msg.channel.send("Iya, Apa Zeyeng?")
  
    if (msg.content === "bucin") 
    msg.channel.send("Pasti Ura :(")  
  
    if (msg.content === "@Sykinyanku") 
    msg.channel.send("Prefix Saya Adalah *!!* ")  
  
    if (msg.content === "welcome") 
    msg.channel.send("WELCOME TO SERVER SYIKINYANKU AND HAVE FUN :D ")  
  
    if (msg.content === "Thank you") 
    msg.channel.send(" Thank you, I'll say goodbye soon, Though its the end of the world, Don't blame yourself now, And if its true, I will surround you and give life to a world, That's our own :D ") 
   
    if (msg.content === "Bosan") 
    msg.channel.send("Bosan? Sini Sama Om")  
  
    if (msg.content === "!!") 
    msg.channel.send("Ya Prefixnya Itu Goblog!! ")  
  
    if (msg.content === "ih ngegas") 
    msg.channel.send("Serah Gw KONTOL!!!")  
  
    if (msg.content === "kntl") 
    msg.channel.send("Jangan NGEGAS ANJING!!!") 
  
    if (msg.content === "@everyone") 
    msg.channel.send("GK USAH NGETAG2 BABI!!!") 
  
    if (msg.content === "Giveaway") 
    msg.channel.send("") 
  
  
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREFIX)) return undefined;

    const args = msg.content.split(" ");
    const searchString = args.slice(1).join(" ");
    const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
    const serverQueue = queue.get(msg.guild.id);

    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    if (command === "help" || command == "cmd") {
        const helpembed = new Discord.RichEmbed()
            .setColor("#7289DA")
            .setAuthor(bot.user.tag, bot.user.displayAvatarURL)
            .setDescription(`
__**Commands List Music**__
> \`play\` > **\`play [title/url]\`**
> \`search\` > **\`search [title]\`**
> \`skip\`, \`stop\`,  \`pause\`, \`resume\`
> \`nowplaying\`, \`queue\`, \`volume\``)
            .setFooter("Dibuat Oleh HufFFadil#8748"); //di situ lo bisa nambhain nama lo. :v
        msg.channel.send(helpembed);
    }
    if (command === "play" || command === "p") {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send("Maaf Bro Lu Gak di Voice Channel Join sono");
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has("CONNECT")) {
            return msg.channel.send("Maaf Tapi Gw Gak ada Permissions");
        }
        if (!permissions.has("SPEAK")) {
            return msg.channel.send("Gw gak ada Permissions Bro");
        }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return msg.channel.send(`<:yes:591629527571234819>  **|**  Playlist: **\`${playlist.title}\`** has been added to the queue!`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    var video = await youtube.getVideoByID(videos[0].id);
                    if (!video) return msg.channel.send("🆘  **|**  I could not obtain any search results.");
                } catch (err) {
                    console.error(err);
                    return msg.channel.send("🆘  **|**  I could not obtain any search results.");
                }
            }
            return handleVideo(video, msg, voiceChannel);
        }
    }
    if (command === "search" || command === "sc") {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send("I'm sorry but you need to be in a voice channel to play a music!");
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has("CONNECT")) {
            return msg.channel.send("Sorry, but I need **`CONNECT`** permissions to proceed!");
        }
        if (!permissions.has("SPEAK")) {
            return msg.channel.send("Sorry, but I need **`SPEAK`** permissions to proceed!");
        }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return msg.channel.send(`<:yes:591629527571234819>  **|**  Playlist: **\`${playlist.title}\`** Dah Gw Masukin Tuh Sabar`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    msg.channel.send(`
__**Song selection**__

${videos.map(video2 => `**\`${++index}\`  |**  ${video2.title}`).join("\n")}

Please provide a value to select one of the search results ranging from 1-10.
					`);
                    // eslint-disable-next-line max-depth
                    try {
                        var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                            maxMatches: 1,
                            time: 10000,
                            errors: ["time"]
                        });
                    } catch (err) {
                        console.error(err);
                        return msg.channel.send("No or invalid value entered, cancelling video selection...");
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send("🆘  **|**  I could not obtain any search results.");
                }
            }
            return handleVideo(video, msg, voiceChannel);
        }

    } else if (command === "skip") {
        if (!msg.member.voiceChannel) return msg.channel.send("He anda Yah Belom Masuk Voice dah di skip");
        if (!serverQueue) return msg.channel.send("There is nothing playing that I could **\`skip\`** for you.");
        serverQueue.connection.dispatcher.end("Skip command has been used!");
        msg.channel.send("⏭️  **|**  Skip command has been used!");
        return undefined;

    } else if (command === "stop") {
        if (!msg.member.voiceChannel) return msg.channel.send("I'm sorry but you need to be in a voice channel to play music!");
        if (!serverQueue) return msg.channel.send("There is nothing playing that I could **\`stop\`** for you.");
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end("Stop command has been used!");
        msg.channel.send("⏹️  **|**  Stop command has been used!");
        return undefined;

    } else if (command === "volume" || command === "vol") {
        if (!msg.member.voiceChannel) return msg.channel.send("Lo Belum Masuk Voice gan");
        if (!serverQueue) return msg.channel.send("Gak ada Yang Di Play :v");
        if (!args[1]) return msg.channel.send(`The current volume is: **\`${serverQueue.volume}%\`**`);
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
        return msg.channel.send(`I set the volume to: **\`${args[1]}%\`**`);

    } else if (command === "nowplaying" || command === "np") {
        if (!serverQueue) return msg.channel.send("Gak ada Music Yang Di Play Bos");
        return msg.channel.send(`🎶  **|**  Now Playing: **\`${serverQueue.songs[0].title}\`**`);

    } else if (command === "queue" || command === "q") {
        if (!serverQueue) return msg.channel.send("Gak ada apa apa nih disini :v");
        return msg.channel.send(`
__**Song Queue**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}

**Now Playing: \`${serverQueue.songs[0].title}\`**
        `);

    } else if (command === "pause") {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send("⏸  **|**  Paused the music for you!");
        }
        return msg.channel.send("There is nothing playing.");

    } else if (command === "resume") {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send("▶  **|**  Resumed the music for you!");
        }
        return msg.channel.send("There is nothing playing.");
    }
    return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 1,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`I could not join the voice channel: **\`${error}\`**`);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return msg.channel.send(`<:yes:591629527571234819>  **|** **\`${song.title}\`** has been added to the queue!`);
    }
    return undefined;
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
  
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on("end", reason => {
            if (reason === "Stream is not generating quickly enough.") console.log("Song Ended");
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textChannel.send(`🎶  **|**  Start Playing: **\`${song.title}\`**`);
  
}
//Fitur Welcome Bergambar// //masih DI FIX JANGAN DIGANGGU//
  bot.on("guildMemberAdd", async member =>  {
  
  let namam = member.user.username
  let batasnama = namam.length > 12 ? namam.substring(0.10) + "..." :namam;
    async function createCanvas() {
      
  let imageUrlPhoto = /\?size=2048$/g;
  
  let image = 'https://cdn.discordapp.com/attachments/703035380558987326/726301214135812177/original_1.gif';
  
  let {body: background} = await superagent.get(image)
  let {body: avatar} = await superagent.get(member.user.displayAvatarUrl.replace(imageUrlPhoto, "?size=128"));
  
  return new Canvas(856,376)
      .setColor('#0297fc')
      .setTextFont('bolt 30px Arial')
      .addImage(background, 0, 0, 856, 376)
      .addText(`${batasnama}`, 165, 550)
      .addRoundImage(avatar, 110, 50, 256, 256, 128)
      .toBufferAsync();
  
   
  }
    
  
  let channel = member.guild.channels.get('693961198214971501');
    channel.send(`Selamat Datang Di Syikinyankuツ, Semoga Kalean Betah Ya!!! ${member.user.username}`, {
      
  files: [{
    attachment: await createCanvas(),
    name:'DilzyTams Welcome Image.gif'
    
  
  
  }]    
  
      
      
      
  })

    

    
});
            
                
bot.login('NzI0ODM5MDg2MDY5Nzc2Mzk0.XvIBLg.QN4ypE9o0Iqy5v_evLd_FMxDoNY');
