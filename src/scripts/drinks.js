const cheerio = require('cheerio');
const axios = require("axios");
const puppeteer = require('puppeteer');
const { insertMany } = require('../db/global-operations.js');

const URL = `https://www.saq.com/en`;
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
		await axios
			.get(`${URL}/products?p=${page}&product_list_limit=${MAX_VIEW_PER_PAGE}`)
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
	insertMany(process.env.COLLECTION_DRINKS, list);
}

async function detail(id) {
	const browser = await puppeteer.launch();
	const context = browser.defaultBrowserContext();
	const page = await browser.newPage();

	await context.overridePermissions(`${URL}/${id}`, ['geolocation']);
	await page.setGeolocation({ latitude: 45.508888, longitude: -73.561668 })
	await page.goto(`${URL}/${id}`);

	let btn = await page.$('#product_addtocart_form > div > div > div.available-in-store > div.wrapper-more-availability > div > button');
	await btn.click();

	const selectorForLoadMoreButton = '#off-canvas-instore > div.wrapper-store > div > div > div.list-map-container > div > div.list-footer > div > div.action-toolbar.pagination > button'
	
	let loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
	while (loadMoreVisible) {
		await page
			.click(selectorForLoadMoreButton)
			.catch(() => { });
		loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
	}

	const list = await page.$$eval('#off-canvas-instore > div.wrapper-store > div > div > div.list-map-container > div > ul > li > div',
		els => els.map(el => {
			const obj = {
				storeName: el.querySelector('h4').textContent,
				available: el.querySelector('strong').textContent
			}
			return obj;
		})
	);
	
	browser.close();

	return list;
}

async function isElementVisible(page, cssSelector) {
	let visible = true;
	await page
		.waitForSelector(cssSelector, { visible: true, timeout: 2000 })
		.catch(() => {
			visible = false;
		});
	return visible;
};

module.exports = {
	loadDataIntoDb,
	detail
};


// async function getMaxViewPerPage() {
// 	let viewPerPages = [];
// 	await axios
// 		.get(`${URL}`)
// 		.then((response) => {
// 			const $ = cheerio.load(response.data);
// 			const options = $('#limiter-bottom option');
// 			options.each((idx, el) => {
// 				let value = $(el).attr('value').replace(REGEX_SPACE_TRIM, " ");
// 				viewPerPages.push(parseInt(value));
// 			});
// 		});

// 	return viewPerPages[viewPerPages.length - 1];
// }

// async function getMaxPage() {
// 	let maxPage = 0;
// 	await axios
// 		.get(`${URL}?product_list_limit=${MAX_VIEW_PER_PAGE}`)
// 		.then((response) => {
// 			const $ = cheerio.load(response.data);
// 			const span = $('.toolbar-amount span')[2];
// 			const resultStr = $(span).text().replace(REGEX_SPACE_TRIM, " ");
// 			const resultNbr = parseInt(resultStr);
// 			return resultNbr;
// 		})
// 		.then((result) => {
// 			maxPage = Math.ceil(result / MAX_VIEW_PER_PAGE);
// 		});

// 	return maxPage;
// };



