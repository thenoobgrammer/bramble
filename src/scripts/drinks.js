const cheerio = require('cheerio');
const axios = require("axios");
const db = require('../db.js');

const REGEX_SPACE_TRIM = /\s+/g;

const url = `https://www.saq.com/en/products`;
const query = `product_list_limit=96`;

async function loadDataIntoDb() {
	const maxViewPerPage = await getMaxViewPerPage();
	const maxPage = await getMaxPage(maxViewPerPage);
	
	let list = [];
	for (let page = 1; page < maxPage; page++) {
		console.log(page)
		await axios
			.get(`${url}?p=${page}&${query}`)
			.then((response) => {
				const $ = cheerio.load(response.data);
				const listDrinks = $('li.item.product.product-item');
				listDrinks.each((idx, el) => {
					const product_name = $(el).find('.product-item-name a').text();
					const span = $(el).find('.saq-code span')[1];
					const saq_code = $(span).text();
					const obj = {
						productName: product_name.replace(REGEX_SPACE_TRIM, " "),
						saqCode: saq_code.replace(REGEX_SPACE_TRIM, " ")
					};
					list.push(obj);
				});
			});
	};
	
	console.log(list.length);
	db.insertMany('drinks', list);
	db.close();
}

async function getMaxViewPerPage() {
	let viewPerPages = [];

	await axios
		.get(`${url}?${query}`)
		.then((response) => {
			const $ = cheerio.load(response.data);
			const options = $('#limiter-bottom option');
			options.each((idx, el) => {
				let value = $(el).attr('value').replace(REGEX_SPACE_TRIM, " ");
				viewPerPages.push(parseInt(value));
			});
		});
	
	return viewPerPages[viewPerPages.length - 1];
}

async function getMaxPage(maxViewPerPage) {
	let maxPage = 0;
	await axios
		.get(`${url}?${query}`)
		.then((response) => {
			const $ = cheerio.load(response.data);
			const span = $('.toolbar-amount span')[2];
			const resultStr = $(span).text().replace(REGEX_SPACE_TRIM, " ");
			const resultNbr = parseInt(resultStr);
			return resultNbr;
		})
		.then((result) => {
			maxPage = Math.ceil(result / maxViewPerPage);
		});

	return maxPage;
};



module.exports = {
	loadDataIntoDb
};




