const { API } = require('./api');

module.exports = Object.freeze({
    getByGenre : async function(commandName, genre) {
        return API.anime.get(`/genre/${commandName}/${genre}`, {
            order_by: 'score'
        })
        .then((response) => {
            let animes = response.data.anime;
            let urls = animes.map(x => x.url)
            let rand = Math.floor(Math.random() * urls.length); 
            return urls[rand];
        })
        .catch(error => console.log(error))
    },
});