import ytdl from 'ytdl-core';
import { DMChannel, EmbedFieldData, MessageEmbed, NewsChannel, StreamDispatcher, TextChannel, VoiceConnection } from 'discord.js';
import { Song } from '../interface/song';

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

export const setConnection = (incomingConnection: VoiceConnection): void => {
    connection = incomingConnection;
}

export const addToQueue = (songs: Song []): void => {
    if(!songs || songs.length === 0) return;

    songs.forEach(song => queue.push(song));

    const isSongPlaying = queue.find(x => x.isPlaying);

    if(!isSongPlaying)
        play(0);
}

export const skip = (songIdx: number): void => {
    songIdx--;

    unloop();

    const currPlayingIdx = queue.findIndex(x => x.isPlaying);

    if (queue.length === 0 || songIdx < 0 || songIdx > queue.length - 1 || songIdx === currPlayingIdx || currentSongPlaying === queue[songIdx]) return;

    queue[currPlayingIdx].isPlaying = false;
    play(songIdx);
}

export const resume = (): void => {
    dispatcher.resume();
}

export const pause = (): void => {
    dispatcher.pause()
}

export const stop = (): void => {
    dispatcher.end();
}

export const next = (): void => {
    if (!queue || queue.length === 0) return;

    const currPlayingIdx = queue.findIndex(x => x.isPlaying);
    
    if(queue[currPlayingIdx].loop) 
        play(currPlayingIdx);
    
    else {
        const nextIdx = (queue.length === 1 || currPlayingIdx === queue.length - 1) ? 0 : currPlayingIdx + 1;
        queue[currPlayingIdx].isPlaying = false;
        play(nextIdx);
    }
}

export const previous = (): void => {
    if (!queue)
        return;

    const currPlayingIdx = queue.findIndex(x => x.isPlaying);
    const prevIdx = (queue.length === 1 || currPlayingIdx === 0) ? queue.length - 1 : currPlayingIdx - 1;

    queue[currPlayingIdx].isPlaying = false;
    play(prevIdx);
}

export const remove = (songIdx: number): void => {
    songIdx--;
    if (queue.length === 0 || songIdx < 0 || songIdx > queue.length - 1) return;

    const currentPlayingIdx = queue.findIndex(x => x.isPlaying);

    if (songIdx === currentPlayingIdx) next();

    queue.splice(songIdx, 1);
}

export const clear = (): void => {
    dispatcher.end();
    queue = [];
}

export const volume = (volume: number): void => {
    currentVolume = volume < 0 ? 0 : volume
    dispatcher.setVolume(currentVolume);
}

export const loop = (): void => {
    const currentPlayingIdx = queue.findIndex(x => x.isPlaying);
    console.log(currentPlayingIdx)
    
    if(currentPlayingIdx < 0)
        return

    queue[currentPlayingIdx].loop = true;
}

export const unloop = () => {
    const currLoopedSongIdx = queue.findIndex(x => x.loop);
    
    if(currLoopedSongIdx < 0)
        return

    queue[currLoopedSongIdx].loop = false;
}

export const play = async (idx: number): Promise<void> => {
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

export const seeQueue = async (channel: TextChannel | DMChannel | NewsChannel): Promise<void> => {
    const embed = new MessageEmbed()
        .setTitle(`Current queue`)
        .setColor('#008369')
        .setDescription(queue.map((song, idx) => {
            if (song.isPlaying)
                return `\`\`\`yaml\n${idx + 1}. ${song.title} (Req by. ${song.author}) ${song.loop ? '- LOOPED' : ''}\`\`\``;
            return `${idx + 1}. ${song.title} (Req by. ${song.author}) ${song.loop ? '- LOOPED' : ''}`;
        }))
    await channel.send(embed);
}

export const displayHelp = async (channel: TextChannel | DMChannel | NewsChannel): Promise<void> => {
    const embed = new MessageEmbed()
        .setTitle(`Here are the commands for the music Bot`)
        .setColor('#7A2F8F')
        .addFields(commands)
    await channel.send(embed);
}