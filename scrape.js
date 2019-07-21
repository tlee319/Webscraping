const request = require('request');
const cheerio = require('cheerio');
const requestPromise = require('request-promise');

var options = {
    uri: 'https://www.baseball-reference.com/leagues/MLB/2019.shtml',
    headers: {
        'User-Agent': 'request'
    }
}

var BASEURL = 'https://www.baseball-reference.com/players/';

var optionsListOfPlayersA = {
    uri: BASEURL + 'a/'
}
var alphabets = 'abcdefghijklmnopqrstuvwxyz';

var AllMLBPlayers = {};

for (let x = 0; x < alphabets.length; x++) {
    const letter = alphabets[x];
    var optionsListOfPlayers = {
        uri: BASEURL + letter
    }

    runRequest(optionsListOfPlayers, letter)
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
            console.log(AllMLBPlayers); // send it to database
        }
       // console.log({listOfPlayersWithLastNameA})
    });

    return listOfPlayersWithLastNameA;
}



/*
request(options, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        let teamBattingTable = {};

        $('.table_outer_container').each((index, element) => {
            const $element = $(element);
            const tableString = $element.text();

            $element.find('tr').each((i, tr) => {
                const $tr = $(tr);

                const teamname = '';

                $tr.find('th a').each((j, th) => {
                    const $th = $(th);
                    teamName = $th.html();
                    teamBattingTable[teamName] = {};
                });

                $tr.find('td').each((j, td) => {
                    const $td = $(td);

                    teamBattingTable[teamName][$td.attr('data-stat')] = $td.html();
                });
            })
        });

        console.log(teamBattingTable);
    }
});

*/