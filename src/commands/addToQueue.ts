import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import { search } from "../utils/search";

export const addToQueue: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add song to queue.")
    .addStringOption((option) =>
      option
        .setName("titles")
        .setDescription("The song title (full if possible)")
        .setRequired(true)
    ) as SlashCommandBuilder,
  run: async (interaction, currentQueue) => {
    await interaction
      .reply({
        content: "Please hold a moment while I'm fetching your songs...",
      })
      .then(async () => {
        const { user, options } = interaction;
        const songTitles = options.getString("titles")?.split(";");
        const songs = songTitles ? search(songTitles, user.username) : [];

        await Promise.resolve(songs).then((songs) => {
          songs.forEach((song) => currentQueue?.push(song));
        });
      })
      .finally(() => {
        interaction.editReply({
          content: "Songs fetched! Type /queue to see the current Queue.",
        });
      });
  },
};
