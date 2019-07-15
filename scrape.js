const request = require('request');
const cheerio = require('cheerio');

request('https://www.baseball-reference.com/leagues/MLB/2019.shtml', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        const divs = $('.section_heading');
        const divString = divs.html();
        let isOnFirstDiv = false;
        let firstIndex = 0;
        let foundDivs = [];
        for (let x = 0; x < divString.length; x++) {
            if (isDiv(divString, x)) {
                if (isOnFirstDiv) {
                    foundDivs.push(divString.slice(firstIndex, x));
                    isOnFirstDiv = false;
                } 
                else {
                    firstIndex = x;
                    isOnFirstDiv = true;
                }
            }
        }

        for (let x = 0; x < foundDivs.length; x++) {
            const subString = foundDivs[x].substring(0, 3);
            console.log(subString);

            if (subString === 'td c') {
                console.log('yeeeeeeee' + foundDivs[x]);
            }

        }
        
        //console.log('found divs: ' + foundDivs.length);
    }
});

function isDiv(divString, index) {
    // checking for divs...

    if (divString[index] === 'd' && divString[index + 1] === 'i' && divString[index + 2] === 'v') {
        return true;
    }

    return true;
}