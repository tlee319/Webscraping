const request = require('request');
const cheerio = require('cheerio');

request('https://www.baseball-reference.com/leagues/MLB/2019.shtml', (error, response, html) => {
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