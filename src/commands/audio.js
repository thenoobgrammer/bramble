
async function playAudio(msg, path) {
    console.log(path)
    const vChannel = msg.member.voice.channel;
    await vChannel.join()
        .then(connection => {
            const dispatcher = connection.play(path, { seek: 0, volume: 0.5 });
            dispatcher.on('finish', () => {
                vChannel.leave()
            });
        });
}

module.exports = {
    playAudio
}