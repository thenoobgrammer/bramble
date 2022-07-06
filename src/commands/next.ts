import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getNextResource } from "../utils/queueManager";

export const next: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("next")
    .setDescription("Play next song in currentQueue."),
  run: async (interaction, currentQueue, player) => {
    if (!currentQueue || currentQueue.length === 0) {
      interaction?.reply({
        content: "Queue is empty. Please load songs first.",
      });
      return
    };

    interaction?.reply({
      content: "Playing next song in queue!",
    });
    
    player?.play(getNextResource(currentQueue))
  },
};
