import { Client, VoiceChannel } from 'discord.js'
import ytsr, { Video } from 'ytsr';
import { Song } from './src/model/Song';
import { addToQueue, skip, resume, next, loop, volume, previous, remove, clear, seeQueue, displayHelp, setConnection} from './src/commands/Music';

require('dotenv').config();

const channel_id: string = process.env.CHANNEL_ID as string;
const token: string = process.env.BOT_TOKEN as string
const bot = new Client();
const prefix = '!';

bot.login(token);
bot.on('ready', () => {
    const channel = bot.channels.cache.get(channel_id);
    (channel as VoiceChannel).join().then(connection => {
        setConnection(connection);
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
        case 'play': search(args[0].split(';'), msg.author.username).then(result => addToQueue(result)); break;
        case 'skip': skip(args.join(' ') as unknown as number); break;
        case 'resume': resume(); break;
        case 'next': next(); break;
        case 'loop': loop(); break;
        case 'vol': volume(args.join(' ') as unknown as number); break;
        case 'prev': previous(); break;
        case 'rm': remove(args.join(' ') as unknown as number); break;
        case 'clr': clear(); break;
        case 'q': seeQueue(msg.channel); break;
        case 'mhelp': displayHelp(msg.channel); break;

        default: return;
    }

    async function search(queries: string[], author: string): Promise<Song[]> {
        const songs: Song[] = [];
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
    }
});
