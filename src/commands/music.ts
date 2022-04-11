import ytdl = require('ytdl-core');
import { DMChannel, EmbedFieldData, MessageEmbed, NewsChannel, StreamDispatcher, TextChannel, VoiceConnection } from 'discord.js';
import { Song } from '../model/song';

const commands: EmbedFieldData[] = [
    { name: 'play - song1;song2;song3', value: 'Plays first video from Youtube search', inline: false },
    { name: 'pause', value: 'Pause music', inline: false },
    { name: 'resume', value: 'Resume music', inline: false },
    { name: 'skip - The position of the song', value: 'Skip to a song in the queue', inline: false },
    { name: 'next', value: 'Play next music in the queue', inline: false },
    { name: 'prev', value: 'Play previous song in the queue', inline: false },
    { name: 'vol - 0 to 1', value: 'Adjust volume of music', inline: false },
    { name: 'rm - Position of song in the queue', value: 'Remove song from queue', inline: false },
    { name: 'clr', value: 'Clears the current queue', inline: false },
    { name: 'q', value: 'Display the current queue', inline: false },
    { name: 'mhelp', value: 'Help list', inline: false },
];

let currentVolume: number;
let currentSongPlaying: Song;
let connection: VoiceConnection;
let dispatcher: StreamDispatcher;
let queue: Song[] = [];

function setConnection(incomingConnection: VoiceConnection): void {
    connection = incomingConnection;
}

function addToQueue(songs: Song []): void {
    if(!songs || songs.length === 0) return;

    songs.forEach(song => queue.push(song));

    const isSongPlaying = queue.find(x => x.isPlaying);

    if(!isSongPlaying)
        play(0);
}


function skip(songIdx: number): void {
    songIdx--;

    unloop();

    const currPlayingIdx = queue.findIndex(x => x.isPlaying);

    if (queue.length === 0 || songIdx < 0 || songIdx > queue.length - 1 || songIdx === currPlayingIdx || currentSongPlaying === queue[songIdx]) return;

    queue[currPlayingIdx].isPlaying = false;
    play(songIdx);
}

function resume(): void {
    dispatcher.resume();
}

function pause(): void {
    dispatcher.pause()
}

function stop(): void {
    dispatcher.end();
}

function next(): void {
    if (!queue || queue.length === 0) return;

    const currPlayingIdx = queue.findIndex(x => x.isPlaying);
    
    if(queue[currPlayingIdx].loop) 
        play(currPlayingIdx);
    
    else {
        let nextIdx = (queue.length === 1 || currPlayingIdx === queue.length - 1) ? 0 : currPlayingIdx + 1;
        queue[currPlayingIdx].isPlaying = false;
        play(nextIdx);
    }
}

function previous(): void {
    if (!queue || queue.length === 0)
        return;

    const currPlayingIdx = queue.findIndex(x => x.isPlaying);
    let prevIdx = (queue.length === 1 || currPlayingIdx === 0) ? queue.length - 1 : currPlayingIdx - 1;

    queue[currPlayingIdx].isPlaying = false;
    play(prevIdx);
}

function remove(songIdx: number): void {
    songIdx--;
    if (queue.length === 0 || songIdx < 0 || songIdx > queue.length - 1) return;

    const currentPlayingIdx = queue.findIndex(x => x.isPlaying);

    if (songIdx === currentPlayingIdx) next();

    queue.splice(songIdx, 1);
}

function clear(): void {
    dispatcher.end();
    queue = [];
}

function volume(volume: number): void {
    currentVolume = volume < 0 ? 0 : volume
    dispatcher.setVolume(currentVolume);
}

function loop(): void {
    const currentPlayingIdx = queue.findIndex(x => x.isPlaying);
    queue[currentPlayingIdx].loop = true;
}

function unloop() {
    const currLoopedSong = queue.findIndex(x => x.loop = x.loop);
    queue[currLoopedSong].loop = false;
}

async function play(idx: number): Promise<void> {
    const audioOpts: ytdl.downloadOptions = {
        dlChunkSize: 5000,
        highWaterMark: 1,
        filter: 'audioonly',
    };

    dispatcher = connection.play(await ytdl(queue[idx].url, audioOpts))
        .on('start', () => { queue[idx].isPlaying = true })
        .on('finish', () => { next() })
        .on('error', console.error);
}

async function seeQueue(channel: TextChannel | DMChannel | NewsChannel): Promise<void> {
    const embed = new MessageEmbed()
        .setTitle(`Current queue`)
        .setColor('#008369')
        .setDescription(queue.map((song, idx) => {
            if (song.isPlaying)
                return `\`\`\`yaml\n${idx + 1}. ${song.title} (Req by. ${song.author}) - ${song.loop ? 'LOOPED' : ''}\`\`\``;
            return `${idx + 1}. ${song.title} (Req by. ${song.author}) - ${song.loop ? 'LOOPED' : ''}`;
        }))
    await channel.send(embed);
}

//Displays commands for music
async function displayHelp(channel: TextChannel | DMChannel | NewsChannel): Promise<void> {
    const embed = new MessageEmbed()
        .setTitle(`Here are the commands for the music Bot`)
        .setColor('#7A2F8F')
        .addFields(commands)
    await channel.send(embed);
}

export default {
    addToQueue,
    play,
    stop,
    skip,
    loop,
    unloop,
    pause,
    resume,
    next,
    previous,
    volume,
    remove,
    clear,
    setConnection,
    seeQueue,
    displayHelp
}