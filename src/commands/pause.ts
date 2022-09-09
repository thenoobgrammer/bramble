import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";

export const pause: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses music."),
    run: async (interaction) => {
        await interaction.deferReply();
        const { channel, user } = interaction;
    }
    
}