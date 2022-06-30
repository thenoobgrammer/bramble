import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";

export const resume: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes music."),
    run: async (interaction) => {
        await interaction.deferReply();
        const { channel, user } = interaction;
    }
    
}