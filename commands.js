const { API } = require('./api');

module.exports = Object.freeze({
    fetch_by_genre : async function(commandName, genre, msg) {
        return API.get(`/genre/${commandName}/${genre}`, {
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