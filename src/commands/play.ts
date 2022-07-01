import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  StreamType,
  VoiceConnection,
} from "@discordjs/voice";
import { downloadOptions } from "../utils/downloadOptions";
import ytdl from "ytdl-core";

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
      interaction.reply({
        content: "Queue is empty. Please load songs first.",
      });
      return;
    }

    const { guildId, options } = interaction;
    const param = options.getString("idx");
    const index = param ? parseInt(param) : -1;

    if (index <= 0 || index > currentQueue?.length) {
      interaction.reply({
        content: "Invalid index. Please choose an index in the current queue.",
      });
      return;
    }

    const connection = guildId ? getVoiceConnection(guildId) : null;

    const url = currentQueue ? currentQueue[index - 1].url : "";

    const stream = ytdl(url, downloadOptions);
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    if (player) {
      console.log(player);
      player.play(resource);
      connection?.subscribe(player);
    }
  },
};
