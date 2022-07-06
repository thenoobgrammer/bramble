import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";

export const clear: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear current queue."),
    run: async (interaction) => {
        await interaction.deferReply();
        const { channel, user } = interaction;
    }
    
}