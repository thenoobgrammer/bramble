import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";

export const clear: CommandInt = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear current queue."),
    run: async (interaction, currentQueue, player) => {
        await interaction
            .reply({ content: 'Clearing the queue' })
            .then(() => player?.stop())
            .then(() => currentQueue?.splice(0, currentQueue.length))
            .finally(() => interaction.editReply({ content: 'Queue cleared.' }))

    }

} 