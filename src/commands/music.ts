import fs = require('fs');
//const ytdl = require('ytdl-core');
import ytdl = require('ytdl-core');
import { DMChannel, EmbedFieldData, MessageEmbed, NewsChannel, StreamDispatcher, TextChannel, VoiceConnection } from 'discord.js';
import { Song } from '../model/song';

const commands: EmbedFieldData[] = [
    { name: 'play', value: 'Plays first video from Youtube search', inline: false },
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

//Sets the connection
function setConnection(incomingConnection: VoiceConnection): void {
    connection = incomingConnection;
}

//Add new song to queue list
function addToQueue(song: Song): void {
    queue.push(song);
    if (queue.length === 1)
        play(0)
}

//Plays an audio. 
//OptionalIdx is passed as optional. Can be without.
async function play(idx: number): Promise<void> {
    const audioOpts: ytdl.downloadOptions = {
        dlChunkSize: 5000,
        highWaterMark: 1,
        filter: 'audioonly',
    };

    
    dispatcher = connection.play(await ytdl(queue[idx].url, audioOpts))
        .on('start', () => {
            queue[idx].isPlaying = true;
        })
        .on('finish', () => {
            next()
        })
        .on('error', console.error);
}

//Skip to a specific index in the queue list
function skip(songIdx: number): void {
    songIdx--;

    const currPlayingIdx = queue.findIndex(x => x.isPlaying);

    if (queue.length === 0 || songIdx < 0 || songIdx > queue.length - 1 || songIdx === currPlayingIdx || currentSongPlaying === queue[songIdx])
        return;

    queue[currPlayingIdx].isPlaying = false;
    play(songIdx);
}


//Resumes song
function resume(): void {
    dispatcher.resume();
}

//Pauses song
function pause(): void {
    dispatcher.pause()
}

function stop(): void {
    dispatcher.end();
}

//PLays next song in queue
function next(): void {
    if (!queue || queue.length === 0)
        return;

    const currPlayingIdx = queue.findIndex(x => x.isPlaying);
    let nextIdx = (queue.length === 1 || currPlayingIdx === queue.length - 1) ? 0 : currPlayingIdx + 1;
    console.log(`nextIdx: ${nextIdx} currPlayingIdx: ${currPlayingIdx}`)

    queue[currPlayingIdx].isPlaying = false;
    play(nextIdx);
}

//Plays previous song
function previous(): void {
    if (!queue || queue.length === 0)
        return;

    const currPlayingIdx = queue.findIndex(x => x.isPlaying);
    let prevIdx = (queue.length === 1 || currPlayingIdx === 0) ? queue.length - 1 : currPlayingIdx - 1;

    queue[currPlayingIdx].isPlaying = false;
    play(prevIdx);
}

//Removes song from queue list
function remove(songIdx: number): void {
    songIdx--;
    if (queue.length === 0 || songIdx < 0 || songIdx > queue.length - 1)
        return;

    const currentPlayingIdx = queue.findIndex(x => x.isPlaying);

    if (songIdx === currentPlayingIdx) {
        dispatcher.end();
    }

    queue.splice(songIdx, 1);
}

//Clears the current queue
function clear(): void {
    dispatcher.end();
    queue = [];
}

//Sets the volume
function volume(volume: number): void {
    currentVolume = volume < 0 ? 0 : volume
    dispatcher.setVolume(currentVolume);
}

//Checks queue
async function seeQueue(channel: TextChannel | DMChannel | NewsChannel): Promise<void> {
    const embed = new MessageEmbed()
        .setTitle(`Current queue`)
        .setColor('#008369')
        .setDescription(queue.map((song, idx) => {
            if (song.isPlaying)
                return `\`\`\`yaml\n${idx + 1}. ${song.title} (Req by. ${song.author})\`\`\``;
            return `${idx + 1}. ${song.title} (Req by. ${song.author})`;
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