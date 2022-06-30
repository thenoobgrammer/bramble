import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";

export const showQueue: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the queue."),
    run: async (interaction) => {
        await interaction.deferReply();
        const { channel, user } = interaction;
    }
    
}