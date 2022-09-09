import { Song } from "../interface/song";
import ytsr, { Video } from 'ytsr';

export const search = async(titles: string[], requester: string): Promise<Song[]> => {
    const songs: Song[] = [];
    while (titles && titles.length !== 0) {
        const query = titles.pop();
        if (query) {
            const result = await ytsr(query);
            const songInfo: Video = result.items.filter(x => x.type === 'video')[0] as Video;
            const song: Song = {
                title: songInfo.title,
                url: songInfo.url,
                requester: requester,
                isPlaying: false,
                loop: false
            };
            songs.push(song);
        }
    }
    return songs;
}