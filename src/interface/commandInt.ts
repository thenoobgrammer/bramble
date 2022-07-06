import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Song } from "./song";
import { AudioPlayer } from "@discordjs/voice";
import { OptionalParams } from "./optionalParams";

export interface CommandInt {
  name?: string;
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  run: (
    interaction: CommandInteraction,
    currentQueue?: Song[],
    player?: AudioPlayer,
    options?: OptionalParams
  ) => Promise<void>;
}
