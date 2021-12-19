const cheerio = require('cheerio');
const axios = require("axios");
const db = require('../db.js');

const URL = `https://www.saq.com/en/products`;
const REGEX_SPACE_TRIM = /\s+/g;
const DIVIDER = '|';

var MAX_VIEW_PER_PAGE = 96;
var MAX_PAGE = 120;

// async function init() {
// 	console.log('init')
// 	return await axios
// 		.get(`${URL}`)
// 		.then((response) => {
// 			const $ = cheerio.load(response.data);
// 			const options = $('#limiter-bottom option').toArray().map(x => parseInt(x.attribs['value']));
// 			const total_result = parseInt($('.toolbar-number:nth-child(3)').text());
// 			MAX_VIEW_PER_PAGE = options[options.length - 1];
// 			MAX_PAGE = Math.ceil(total_result / MAX_VIEW_PER_PAGE);
// 		})
// 		.finally(() => {
// 			console.log(MAX_PAGE);
// 			console.log(MAX_VIEW_PER_PAGE);
// 		})
// }

async function loadDataIntoDb() {
	let list = [];
	for (let page = 1; page <= MAX_PAGE; page++) {
		console.log(page)
		await axios
			.get(`${URL}?p=${page}&product_list_limit=${MAX_VIEW_PER_PAGE}`)
			.then((response) => {
				const $ = cheerio.load(response.data);
				const listDrinks = $('li.item.product.product-item');
				listDrinks.each((idx, el) => {
					const product_name = $(el).find('.product-item-name a').text().replace(REGEX_SPACE_TRIM, " ").trim();
					const product_info = $(el).find('.product-item-identity-format span').text().replace(REGEX_SPACE_TRIM, " ").split(DIVIDER).filter(x => x !== " " && x !== "").map(x => x.trim());
					const saq_code = $(el).find('.saq-code span:nth-child(2)').text().replace(REGEX_SPACE_TRIM, " ").trim();
					const availability = $(el).find('.availability-container span.label-availabity').toArray().map(x => x.attribs['class']).map(x => x.split(' ').splice(1, 2).reduce(x => x));
					const obj = {
						name: product_name,
						type: product_info[0],
						volume: product_info[1],
						countryFrom: product_info[2],
						saqCode: saq_code,
						online: availability[0],
						store: availability[1]
					};
					list.push(obj);
				});
			});
	};
	//console.log('End')
	db.insertMany('drinks', list);
	db.close();
}

async function getMaxViewPerPage() {
	let viewPerPages = [];

	await axios
		.get(`${URL}`)
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

async function getMaxPage() {
	let maxPage = 0;
	await axios
		.get(`${URL}?product_list_limit=${MAX_VIEW_PER_PAGE}`)
		.then((response) => {
			const $ = cheerio.load(response.data);
			const span = $('.toolbar-amount span')[2];
			const resultStr = $(span).text().replace(REGEX_SPACE_TRIM, " ");
			const resultNbr = parseInt(resultStr);
			return resultNbr;
		})
		.then((result) => {
			maxPage = Math.ceil(result / MAX_VIEW_PER_PAGE);
		});

	return maxPage;
};

module.exports = {
	loadDataIntoDb,
	//init
};




