import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";

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
    run: async (interaction) => {
        await interaction.deferReply();
        const { channel, user } = interaction;
    }
    
}