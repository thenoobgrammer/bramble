const cheerio = require('cheerio');
const axios = require("axios");
const url = `https://www.saq.com/en/products`;
const query = `product_list_limit=96`;

axios.get(`${url}?${query}`).then((response) => {
    const $ = cheerio.load(response.data);
    const listDrinks = $('li.item.product.product-item');
    for(var i = 0; i < listDrinks.length; i++) {
        console.log(listDrinks[i])
    }
    console.log(listDrinks.length);
});