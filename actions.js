module.exports = Object.freeze({
    playAudioFile: async function(msg, path) {
        const vChannel = msg.member.voice.channel;
        await vChannel.join()
        .then(connection => {
            const dispatcher = connection.play(path, { seek: 0, volume: 0.5 });
            dispatcher.on('speaking', speaking => {
                if(!speaking)
                    vChannel.leave()
            });
        });
    },

    type: function(msg, msgToType) {
        msg.channel.send(msgToType);
    }
})