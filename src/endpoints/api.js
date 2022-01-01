const axios = require('axios');
const anime = axios.create({
    baseURL: 'https://api.jikan.moe/v3',
    timeout: 1000
})
const drinks = axios.create({
    baseURL: 'https://www.thecocktaildb.com/api/json/v1/1',
    timeout: 1000
})
const weather = axios.create({
    baseURL: 'https://api.jikan.moe/v3',
    timeout: 1000
})


module.exports.API = {
    anime,
    drinks,
    weather
}; 