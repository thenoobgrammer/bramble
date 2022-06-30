import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";

export const previous: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Plays previous song in queue."),
    run: async (interaction) => {
        await interaction.deferReply();
        const { channel, user } = interaction;
    }
    
}