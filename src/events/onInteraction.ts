import { Interaction } from "discord.js";
import { CommandList } from "../commands/_CommandList";
import { Song } from "../interface/song";

export const onInteraction = async (interaction: Interaction, currentQueue: Song[]): Promise<void> => {
    try {
        if (interaction.isCommand()) {
            for (const command of CommandList) {
                if (interaction.commandName === command.data.name) {
                    await command.run(interaction, currentQueue);
                    break;
                }
            }
        }
    } catch(error) {
        console.error(error)
    }
};