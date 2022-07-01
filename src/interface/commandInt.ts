import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Song } from "./song";
import { OptionalParams } from "./optionalParams";
import { AudioPlayer } from "@discordjs/voice";

export interface CommandInt {
  name?: string;
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  run: (
    interaction: CommandInteraction,
    currentQueue?: Song[],
    player?: AudioPlayer
  ) => Promise<void>;
}
