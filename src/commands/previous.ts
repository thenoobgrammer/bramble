import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getPreviousResource } from "../utils/queueManager";

export const previous: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Plays previous song in queue."),
  run: async (interaction, currentQueue, player) => {
    if (!currentQueue || currentQueue.length === 0) {
      interaction?.reply({
        content: "Queue is empty. Please load songs first.",
      });
      return;
    }

    interaction?.reply({
      content: "Playing next song in queue!",
    });

    player?.play(getPreviousResource(currentQueue));
  },
};
