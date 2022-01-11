import { Client, VoiceChannel } from 'discord.js'
import ytsr, { Video } from 'ytsr';
import { Song } from './model/song';
import music from './commands/music';
import { existsSync, readdirSync } from 'fs';
import { basename } from 'path';
//import audio from './commands/audio';
//import drinks from './commands/drinks';

require('dotenv').config();

const channel_id: string = process.env.CHANNEL_ID as string;
const token: string = process.env.BOT_TOKEN as string
const bot: Client = new Client();
const prefix: string = '!';
const pathToAudios: string = "../sounds";
// const audios = existsSync(pathToAudios) ?
//     readdirSync(pathToAudios)
//         .filter(fileName => fileName.includes('.mp3'))
//         .map(fileName => basename(fileName, '.mp3')) : null;

bot.login(token);
bot.on('ready', () => {
    const channel = bot.channels.cache.get(channel_id);
    // if(!channel || channel.type !== Constants.ChannelTypes.VOICE)
    //     return;

    (channel as VoiceChannel).join().then(connection => {
        music.setConnection(connection);
        console.log("Music Bot successfully connected.");
    }).catch(e => {
        console.error(e);
    });
})

bot.on('message', (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift()?.toLowerCase();

    switch (command) {
        case 'play': search(args.join(' '), msg.author.username).then(result => music.addToQueue(result)); break;
        case 'skip': music.skip(args.join(' ') as unknown as number); break;
        case 'resume': music.resume(); break;
        case 'next': music.resume(); break;
        case 'vol': music.volume(args.join(' ') as unknown as number); break;
        case 'prev': music.previous(); break;
        case 'rm': music.remove(args.join(' ') as unknown as number); break;
        case 'clr': music.clear(); break;
        case 'q': music.seeQueue(msg.channel); break;
        case 'mhelp': music.displayHelp(msg.channel); break;

        default: msg.channel.send(`Kho. Abuse moi pas s.v.p !mhelp pour de l'aide`); break;
    }

    //if (command === 'ahelp') audio.displayAudioHelp(msg.channel, audios.map(a => { return { name: a, value: a, inline: false } }));

    // const a = audios.find(x => x === command);

    // if (a)
    //     audio.playAudio(msg, `${pathToAudios}/${a}.mp3`);

    async function search(query: string, author: string): Promise<Song> {
        const result = await ytsr(query);
        const songInfo: Video = result.items.filter(x => x.type === 'video')[0] as Video;
        const song: Song = {
            title: songInfo.title,
            url: songInfo.url,
            author: author,
            isPlaying: false
        };
        return song;
    };
});
