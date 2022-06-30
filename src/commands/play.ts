import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioPlayer, createAudioResource, getVoiceConnection, StreamType, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { downloadOptions } from '../utils/downloadOptions'
import ytdl from 'ytdl-core';

export const play: CommandInt = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play music.")
        .addStringOption((option) =>
            option
                .setName("idx")
                .setDescription("The index of the song to play in the queue.")
                .setRequired(false)
        ) as SlashCommandBuilder,
    run: async (interaction, index) => {
        await interaction.deferReply();

        const { guildId, user, options } = interaction;

        const songTitles = options.getString('titles')?.split(';')
        const connection = (guildId && getVoiceConnection(guildId)) as VoiceConnection
 

        const player = createAudioPlayer();

        const stream = ytdl( , downloadOptions);
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
        player.play(resource)

        connection.subscribe(player)

    }

}