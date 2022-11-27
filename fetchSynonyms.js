import axios from 'axios';
import { parse } from 'node-html-parser';
import fs from 'fs';

(async function example() {
    main();
})();

let kelime_sayisi = 0;
let kelime_limit = 10 * 100000;

let writeSynonymStream = fs.createWriteStream('./synonym_words.csv');

async function main(params) {
    //let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    try {
      await findWord('abacı');
    } finally {
      //await driver.quit();
    }
}

async function findWord(word) {
    const response = await axios.get('https://www.es-anlam.com/kelime/' + word.trim());
    const root = parse(response.data);

    const result_section = root.getElementById('esanlamlar');
    const kelime = result_section.getElementsByTagName('i')[0].text;
    let es_anlamli = result_section.getElementsByTagName('strong')[0].text;
    kelime_sayisi++;
    
    es_anlamli = es_anlamli.split(',')[0];
    es_anlamli = es_anlamli.split('/')[0];

    if (!kelime.includes(' ') && !es_anlamli.includes(' ')) {
        writeSynonymStream.write(kelime + ',' + es_anlamli+ '\n', () => {
            //console.log(kelime, es_anlamli);
        })
    }
    
    const next_word = root.querySelectorAll(".pull-right")[0].text;
    if (kelime_sayisi < kelime_limit && next_word.trim() !== 'zurt') {
        await findWord(next_word.slice(0, -3));
    }
    else {
        writeSynonymStream.end();
    }
}