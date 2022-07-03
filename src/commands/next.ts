import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import { play } from "./play";

export const next: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("next")
    .setDescription("Play next song in currentQueue."),
  run: async (interaction, currentQueue, player) => {
    if (!currentQueue || currentQueue.length === 0) return;

    const currPlayingIdx = currentQueue.findIndex((s) => s.isPlaying) + 1;
    const nextIdx = currPlayingIdx + 1;

    play.run(interaction, currentQueue, player, { nextIndex: nextIdx });
  },
};
