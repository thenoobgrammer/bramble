import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import { downloadOptions } from "../utils/downloadOptions";
import ytdl from "ytdl-core";
import {
  createAudioResource,
  getVoiceConnection,
  StreamType,
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
  run: async (interaction, currentQueue, player, optionParams) => {
    if (!currentQueue || currentQueue?.length <= 0) {
      interaction.reply({
        content: "Queue is empty. Please load songs first.",
      });
      return;
    }

    const { guildId, options } = interaction;
    const paramIdx = options.getString("idx");
    const optionsIdx = optionParams?.nextIndex;
    const a = optionsIdx ? optionsIdx : parseInt(paramIdx!);
    const i = a > currentQueue.length ? 1 : a;

    if (i <= 0) {
      interaction.reply({
        content: "Invalid index. Please choose an index in the current queue.",
      });
      return;
    }

    const connection = guildId ? getVoiceConnection(guildId) : null;
    const url = currentQueue ? currentQueue[i - 1].url : "";
    const stream = ytdl(url, downloadOptions);
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    if (player) {
      player.play(resource);
      connection?.subscribe(player);
      currentQueue.forEach((s) => (s.isPlaying = false));
      currentQueue[i - 1].isPlaying = true;
    }
  },
};
