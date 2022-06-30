import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";

export const stop: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop music and disconnects bot."),
    run: async (interaction) => {
        await interaction.deferReply();
        const { channel, user } = interaction;
    }
    
}