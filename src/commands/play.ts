import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getIndexResource, indexValid } from "../utils/queueManager";
import {
  getVoiceConnection,
} from "@discordjs/voice";

export const play: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music.")
    .addStringOption((option) =>
      option
        .setName("idx")
        .setDescription("The index of the song to play in the queue.")
        .setRequired(false)
    ) as SlashCommandBuilder,
  run: async (interaction, currentQueue, player) => {

    if (!currentQueue || currentQueue?.length <= 0) {
      interaction?.reply({
        content: "Queue is empty. Please load songs first.",
      });
      return;
    }
    
    const reg = new RegExp('^[0-9]+$');
    const { guildId, options } = interaction;
    const input = options.getString("idx") || ''

    if (!reg.test(input)) {
      interaction?.reply({
        content: "Wrong input. Please enter a number.",
      });
      return;
    }

    const index = parseInt(input) - 1;

    if (!indexValid(index, currentQueue)) {
      interaction?.reply({
        content: "Invalid index. Please choose an index in the current queue.",
      });
      return;
    }

    const connection = guildId ? getVoiceConnection(guildId) : null;

    if (player) {
      interaction?.reply({
        content: "Playing your song.",
      });
      player.play(getIndexResource(index, currentQueue));
      connection?.subscribe(player);
    }
  },
};
