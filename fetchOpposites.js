import axios from 'axios';
import { parse } from 'node-html-parser';
import fs from 'fs';

(async function example() {
    main();
})();

let kelime_sayisi = 0;
let kelime_limit = 10 * 10000;

let writeSynonymStream = fs.createWriteStream('./opposite_words.csv');

async function main(params) {
    //let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    try {
      await findWord('abes');
    } finally {
      //await driver.quit();
    }
}

async function findWord(word) {
    const response = await axios.get('https://www.es-anlam.com/zit-anlam/kelime/' + word.trim());
    const root = parse(response.data);

    const result_section = root.getElementById('esanlamlar');
    const kelime = result_section.getElementsByTagName('i')[0].text;
    let zit_anlamli = result_section.getElementsByTagName('strong')[0].text;
    kelime_sayisi++;
    
    zit_anlamli = zit_anlamli.split(',')[0];
    zit_anlamli = zit_anlamli.split('/')[0];

    if (!kelime.includes(' ') && !zit_anlamli.includes(' ')) {
        writeSynonymStream.write(kelime + ',' + zit_anlamli+ '\n', () => {
            //console.log(kelime, zit_anlamli);
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