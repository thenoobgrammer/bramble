import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";

export const next: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("next")
    .setDescription("Play next song in queue."),
    run: async (interaction) => {
        await interaction.deferReply();
        const { channel, user } = interaction;
    }
    
}