const axios = require('axios');
const instance = axios.create({
    baseURL: 'https://api.jikan.moe/v3',
    timeout: 1000
})

module.exports.API = instance; 