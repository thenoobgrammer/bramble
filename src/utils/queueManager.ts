import { downloadOptions } from "./downloadOptions";
import {
    createAudioResource,
    StreamType,
    AudioResource,
} from "@discordjs/voice";
import { Song } from "../interface/song";
import ytdl from "ytdl-core";
import { PythonShell, Options } from 'python-shell';

export const indexValid = (idx: number, queue: Song[]): boolean => {
    return idx >= 0 && idx < queue.length;
};

export const getIndexResource = (idx: number, queue: Song[]): AudioResource => {
    queue.forEach(s => s.isPlaying = false)
    queue[idx].isPlaying = true

    const song = queue[idx];
    const stream = ytdl(song.url, downloadOptions);

    console.log(stream)

    // const options: Options = {
    //     args: [song.url]
    // }

    // PythonShell.run('download.py', options, function (err, results) {
    //     if (err) throw err;
    //     console.log('results: %j', results);
    // });

    return createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
    });
};

export const getNextResource = (queue: Song[]): AudioResource => {
    const currentlyPlaying = queue.findIndex((s) => s.isPlaying);
    const nextInQueue = currentlyPlaying + 1 >= queue.length ? 0 : currentlyPlaying + 1;
    const nextSong = queue[nextInQueue];

    queue.forEach(s => s.isPlaying = false)
    queue[nextInQueue].isPlaying = true;

    const stream = ytdl(nextSong.url, downloadOptions);

    console.log(stream)

    // const options: Options = {
    //     args: [nextSong.url]
    // }

    // PythonShell.run('download.py', options, function (err, results) {
    //     if (err) throw err;
    //     console.log('results: %j', results);
    // });

    return createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
    });
};
