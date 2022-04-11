const MessageEmbed = require('discord.js');

async function playAudio(msg, path) {
    const vChannel = msg.member.voice.channel;
    await vChannel.join()
        .then(connection => {
            connection.play(path, { seek: 0, volume: 0.5 });
        });
}

async function displayAudioHelp(channel, fields) {
    const embed = new MessageEmbed()
        .setTitle(`Here are the commands for the music Bot`)
        .setColor('#7A2F8F')
        .addFields(fields)
    await channel.send(embed);
}


module.exports = {
    playAudio,
    displayAudioHelp
}