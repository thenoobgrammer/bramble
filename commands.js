const PAGE = 1;
const axios = require('axios')
const { type } = require('./actions')
const instance = axios.create({
    baseURL: 'https://api.jikan.moe/v3',
    timeout: 1000
})

module.exports = Object.freeze({
    fetch_by_genre : async function(commandName, genre, msg) {
        instance.get(`/genre/${commandName}/${genre}`, {
            order_by: 'score'
        })
        .then((response) => {
            let data = response.data
            let animes = data.anime;
            let urls = animes.map(x => x.url)
            let rand = Math.floor(Math.random() * urls.length); 

            type(msg, urls[rand]);
        })
    },
});