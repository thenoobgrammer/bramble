import ytdl from 'ytdl-core';

export const downloadOptions: ytdl.downloadOptions = {
    dlChunkSize: 5000,
    highWaterMark: 1,
    filter: 'audioonly',
};