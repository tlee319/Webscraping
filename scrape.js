const request = require('request');
const cheerio = require('cheerio');

request('https://www.baseball-reference.com/leagues/MLB/2019.shtml', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('.section_heading').each((index, element) => {
            const $element = $(element);
            console.log($element.text());
        });
    }
});