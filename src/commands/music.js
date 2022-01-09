const ytdl = require('ytdl-core-discord');
const { MessageEmbed } = require('discord.js');
const defaultVolume = 0.5;
const commands = [
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

let connection = null;
let dispatcher = null;
let queue = [];

//Sets the connection
function setConnection(incomingConnection) {
    connection = incomingConnection;
}

//Add new song to queue list
function addToQueue(songData) {
    queue.push(songData);
    if (queue.length === 1)
        play(0)
}

//Plays an audio. 
//OptionalIdx is passed as optional. Can be without.
async function play(idx) {
    const audioOpts = {
        type: 'opus',
        fmt: 'mp3',
        volume: defaultVolume,
        highWaterMark: 1,
        filter: 'audioonly',
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    };
    if (idx === undefined || idx === null)
        return;

    dispatcher = connection.play(await ytdl(queue[idx].url), audioOpts)
        .on('start', () => {
            queue[idx].playing = true;
        })
        .on('finish', () => {
            queue[idx].playing = false;
            next()
        })
        .on('error', console.error);
}

//Skip to a specific index in the queue list
async function skip(songIdx) {
    songIdx--;

    const currPlayingIdx = queue.findIndex(x => x.playing);

    if (!queue || queue.length === 0 || songIdx < 0 || songIdx > queue.length - 1 || songIdx === currPlayingIdx)
        return;

    queue[currPlayingIdx].playing = false;
    play(songIdx);
}


//Resumes song
async function resume() {
    dispatcher.resume();
}

//Pauses song
async function pause() {
    dispatcher.pause()
}

//PLays next song in queue
async function next() {
    if (!queue || queue.length === 0)
        return;

    const currPlayingIdx = queue.findIndex(x => x.playing);
    let nextIdx = (queue.length === 1 || currPlayingIdx + 1 > queue.length - 1) ? 0 : currPlayingIdx + 1;

    queue[currPlayingIdx].playing = false;
    play(nextIdx);
}

//Removes song from queue list
async function remove(songIdx) {
    songIdx--;
    if (!queue || queue.length === 0 || songIdx < 0 || songIdx > queue.length - 1)
        return;

    queue.splice(songIdx, 1);
}

//Clears the current queue
async function clear() {
    queue = [];
}

//Plays previous song
async function previous() {
    if (!queue || queue.length === 0)
        return;

    const currPlayingIdx = queue.findIndex(x => x.playing);
    let prevIdx = (queue.length === 1 || currPlayingIdx - 1 < 0) ? 0 : currPlayingIdx - 1;

    queue[currPlayingIdx].playing = false;
    play(prevIdx);
}

//Sets the volume
async function volume(volume) {
    dispatcher.setVolume(volume < 0 ? 0 : volume);
}

//Checks queue
async function seeQueue(channel) {
    const embed = new MessageEmbed()
        .setTitle(`Current queue`)
        .setColor('#008369')
        .setDescription(queue.map((song, idx) => {
            if (song.playing)
                return `\`\`\`yaml\n${idx + 1}. ${song.title} (Req by. ${song.author})\`\`\``;
            return `${idx + 1}. ${song.title} (Req by. ${song.author})`;
        }))
    channel.send(embed);
}

//Displays commands for music
async function displayHelp(channel) {
    const embed = new MessageEmbed()
        .setTitle(`Here are the commands for the music Bot`)
        .setColor('#7A2F8F')
        .addFields(commands)
    channel.send(embed);
}

module.exports = {
    addToQueue,
    play,
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