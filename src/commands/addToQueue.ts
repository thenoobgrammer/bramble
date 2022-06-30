import { CommandInt } from "../interface/commandInt";
import { SlashCommandBuilder } from "@discordjs/builders";
import { search } from '../utils/search'

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
        await interaction.deferReply();

        const { user, options } = interaction;

        const songTitles = options.getString('titles')?.split(';')
        const songs = songTitles ? search(songTitles, user.username) : [];
        await Promise
            .resolve(songs)
            .then((songs) => {
                songs
                    .forEach((song) => currentQueue?.push(song))
            })

    }

}