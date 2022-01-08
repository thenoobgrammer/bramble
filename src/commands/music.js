const ytdl = require('ytdl-core-discord');
const { MessageEmbed } = require('discord.js');
const defaultVolume = 0.5;
const commands = [
    { name: 'play', value: 'Plays first video from Youtube search', inline: false},
    { name: 'pause', value: 'Pause music', inline: false},
    { name: 'resume', value: 'Resume music', inline: false},
    { name: 'skip - The position of the song', value: 'Skip to a song in the queue', inline: false},
    { name: 'next', value: 'Play next music in the queue', inline: false},
    { name: 'prev', value: 'Play previous song in the queue', inline: false},
    { name: 'vol - 0 to 1', value: 'Adjust volume of music', inline: false},
    { name: 'rm - Position of song in the queue', value: 'Remove song from queue', inline: false},
    { name: 'q', value: 'Display the current queue', inline: false},
    { name: 'mhelp', value: 'Help list', inline: false},
];

let connection = null;
let dispatcher = null;
let currentIdx = 0;
let queue = [];

async function setConnection(incomingConnection) {
    connection = incomingConnection;
}

async function addToQueue(songData) {
    queue.push(songData);
    if (queue.length === 1)
        play()
}

async function play(optionalIdx) {
    const audioOpts = {
        type: 'opus',
        fmt: 'mp3',
        volume: defaultVolume,
        highWaterMark: 1,
        filter: 'audioonly',
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    };

    if (optionalIdx && optionalIdx - 1 >= 0 && optionalIdx - 1 < queue.length) {
        if (optionalIdx - 1 === currentIdx && queue[currentIdx].playing)
            return;
        currentIdx = optionalIdx - 1;
        dispatcher = connection.play(await ytdl(queue[currentIdx].url), audioOpts)
            .on('start', () => {
                queue[currentIdx].playing = true;
            })
            .on('finish', () => {
                queue[currentIdx].playing = false;
                next()
            })
    }

    if (!optionalIdx)
        dispatcher = connection.play(await ytdl(queue[currentIdx].url), audioOpts)
            .on('start', () => {
                queue[currentIdx].playing = true;
            })
            .on('finish', () => {
                queue[currentIdx].playing = false;
                next()
            })
}

async function skip(idxSkiopTo) {
    queue[currentIdx].playing = false;
    play(idxSkiopTo);
}

async function resume() {
    dispatcher.resume();
}

async function pause() {
    dispatcher.pause()
}

async function next() {
    currentIdx = currentIdx >= queue.length - 1 ? 1 : currentIdx + 1;
    play();
}

async function remove(idx) {
    if (idx > 0 && idx <= queue.length) {
        queue.splice(idx - 1, 1);
        currentIdx = currentIdx === 0 ? currentIdx : currentIdx - 1;
    }
}

async function previous() {
    currentIdx = currentIdx <= 0 ? currentIdx : currentIdx - 1;
    play();
}

async function volume(connection, volume) {
    connection.setVolume(volume < 0 ? 0 : volume);
}

async function seeQueue(channel) {
    const embed = new MessageEmbed()
        .setTitle(`Current queue`)
        .setColor('#008369')
        .setDescription(queue.map((song, idx) => {
            if (song.playing)
                return `\`\`\`yaml\n${idx + 1}. ${song.title}\`\`\``;
            return `${idx + 1}. ${song.title}`;
        }))
    channel.send(embed);
}

async function displayHelp(channel) {
    const embed = new MessageEmbed()
        .setTitle(`Here are the commands for the music Bot`)
        .setColor('#7A2F8F')
        .setDescription(``)
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
    setConnection,
    seeQueue,
    displayHelp
}