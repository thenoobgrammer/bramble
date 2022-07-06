import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getNextResource } from "../utils/queueManager";
import { AudioPlayerPlayingState, getVoiceConnection } from "@discordjs/voice";

export const remove: CommandInt = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Removes a song from the queue")
        .addStringOption((option) =>
            option
                .setName('idx')
                .setDescription('The index of the song to be removed.')
                .setRequired(true)
        ) as SlashCommandBuilder,
    run: async (interaction, currentQueue, player) => {
        const reg = new RegExp('^[0-9]+$');
        const { guildId, options } = interaction;
        const input = options.getString("idx") || ''

        if (!currentQueue || currentQueue.length === 0) {
            interaction?.reply({
                content: "Queue is empty. Please load songs first.",
            });
            return
        };

        if (!reg.test(input)) {
            interaction?.reply({
                content: "Wrong input. Please enter a number.",
            });
            return;
        }

        const idx = parseInt(input) - 1

        if (idx < 0 || idx >= currentQueue.length) {
            interaction?.reply({
                content: "Queue is empty. Please load songs first.",
            });
            return
        };

        currentQueue.splice(idx, 1);

        const currentPlayingIdx = currentQueue.findIndex(s => s.isPlaying);

        if (idx === currentPlayingIdx) {
            if (player) {
                player.play(getNextResource(currentQueue));
            }
        }
        interaction?.reply({
            content: "Removed song.",
        });
    }

}