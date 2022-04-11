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
const bot = new Client();
const prefix: string = '!';
const pathToAudios: string = "../sounds";
// const audios = existsSync(pathToAudios) ?
//     readdirSync(pathToAudios)
//         .filter(fileName => fileName.includes('.mp3'))
//         .map(fileName => basename(fileName, '.mp3')) : null;

bot.login(token);
bot.on('ready', () => {
    const channel = bot.channels.cache.get(channel_id);
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

    const args = msg.content.slice(prefix.length).trim().split(/(?<=^\S+)\s/);
    const command = args.shift()?.toLowerCase();
    
    switch (command) {
        case 'play': search(args[0].split(';'), msg.author.username).then(result => music.addToQueue(result)); break;
        case 'skip': music.skip(args.join(' ') as unknown as number); break;
        case 'resume': music.resume(); break;
        case 'next': music.next(); break;
        case 'loop': music.loop(); break;
        case 'vol': music.volume(args.join(' ') as unknown as number); break;
        case 'prev': music.previous(); break;
        case 'rm': music.remove(args.join(' ') as unknown as number); break;
        case 'clr': music.clear(); break;
        case 'q': music.seeQueue(msg.channel); break;
        case 'mhelp': music.displayHelp(msg.channel); break;

        default: return;
    }

    async function search(queries: string[], author: string): Promise<Song[]> {
        let songs: Song[] = [];
        while (queries && queries.length !== 0) {
            const query = queries.pop();
            if (query) {
                const result = await ytsr(query);
                const songInfo: Video = result.items.filter(x => x.type === 'video')[0] as Video;
                const song: Song = {
                    title: songInfo.title,
                    url: songInfo.url,
                    author: author,
                    isPlaying: false,
                    loop: false
                };
                songs.push(song);
            }
        }
        return songs;
    };
});
