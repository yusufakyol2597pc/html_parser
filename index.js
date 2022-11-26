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

async function findWord2(driver, word) {
    await driver.get('https://www.es-anlam.com/kelime/' + word);
    const result_section = await driver.findElement(By.id('esanlamlar'));
    const kelime = await result_section.findElement(By.css('i')).getText();
    const es_anlamli = await result_section.findElement(By.css('strong')).getText();
    kelime_sayisi++;
    console.log(kelime, es_anlamli);
    if (kelime_sayisi < kelime_limit) {
        const next_word = await driver.findElement(By.className('pull-right')).getText();
        await findWord(driver, next_word.slice(0, -3));
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

function writeToCsvFile() {
    
}