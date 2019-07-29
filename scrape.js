const request = require('request');
const cheerio = require('cheerio');

var ffURL = 'https://www.pro-football-reference.com/years/2018/fantasy.htm';
runFFURL({ uri: ffURL, headers: { 'User-Agent': 'request' } });

function runFFURL(options) {
    request(options, (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html);
            console.log('success');

            const allTableRows = $('tbody').find('tr');
            allTableRows.each((index, trElement) => {
                const $trElement = $(trElement);
                //console.log({ trElement: $trElement.html() });

                $trElement.find('td').each((i, tdElement) => {
                    const $tdElement = $(tdElement);
                    const attribute = $tdElement.attr('data-stat');
                    let value = $tdElement.html();

                    if (attribute === 'player' || attribute === 'team') {
                        value = getHtmlValue(value);
                    }

                    console.log({ attribute, value });
                });
            });
        }
    });
}

function getHtmlValue(htmlString) {
    let firstSlice = 0;
    let secondSlice = 0;

    for (let x = 0; x < htmlString.length; x++) {
        if (firstSlice === 0 && htmlString.charAt(x) === '>') {
            firstSlice = x + 1;
        }
        else if (x !== 0 && secondSlice === 0 && htmlString.charAt(x) === '<') {
            secondSlice = x;
            break;
        }
    }

    return htmlString.slice(firstSlice, secondSlice);
}

const BASEURL  = 'https://www.baseball-reference.com/players/';
const alphabets = 'abcdefghijklmnopqrstuvwxyz';
var AllMLBPlayers = {};
for (let x = 0; x < alphabets.length; x++) {
    const letter = alphabets[x];
    var optionsListOfPlayers = {
        uri: BASEURL + letter
    }

    //runRequest(optionsListOfPlayers, letter)
}

function runRequest(options, letter) {
    var listOfPlayersWithLastNameA = [];
    request(options, (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html);
    
            $('.section_content').each((index, element) => {
                if (index === 0) {
                    const $element = $(element);
                    const tableString = $element.find('p').each((index, p) => {
                        const $p = $(p)
                        const resultString = $p.html();
    
                        const info = $p.text();
    
                        const infoArray = info.split(' ');
                        let rookieYear = '';
                        let lastName = '';
                        let firstName = '';
                        for (let x = infoArray.length - 1; x >= 0; x--) {
                            if (x === infoArray.length - 1) {
                                const year = infoArray[x];
                                rookieYear = year.substring(1,5);
                            }
                            else if (x === infoArray.length - 3) {
                                lastName = infoArray[x];
                            }
                            else if (infoArray[x].length > 0 && infoArray[x] !== '') {
                                if (firstName.length === 0) {
                                    firstName = infoArray[x];
                                }
                                else {
                                    firstName = infoArray[x] + ' ' + firstName;
                                }
                            }
                        }
                        if (!AllMLBPlayers[letter]) {
                            AllMLBPlayers[letter] = [{ firstName, lastName, rookieYear }];
                        }
                        else {
                            AllMLBPlayers[letter].push({ firstName, lastName, rookieYear });
                        }
                    });
                    //console.log(tableString);
                }
            })
        }
       // console.log({listOfPlayersWithLastNameA})

       //console.log(AllMLBPlayers); // send it to database
    });

    return listOfPlayersWithLastNameA;
}