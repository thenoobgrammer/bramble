import { Song } from "./song";

export interface QueueItem {
    song: Song
    loop: boolean
    isPlaying: boolean
}