import fs from "fs";

var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?]/;

const myArgs = process.argv.slice(2);
const fileName = myArgs[0];

fs.readFile(fileName, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let words = data.split("\n");
  words = words.filter(word => !format.test(word))
  words = words.filter(word => !word.includes(" "))
  words = words.map(word => word.toLocaleLowerCase());
  words = words.filter(onlyUnique)
  words = words.map(word => word.replace(",,", ","));
  words.sort(function(a, b){
    // ASC  -> a.length - b.length
    // DESC -> b.length - a.length
    return a.length - b.length;
  });

  let writeSynonymStream = fs.createWriteStream('./sorted_' + fileName);
  words.forEach(word => {
    writeSynonymStream.write(word + '\n', () => {
    })
  })
});

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}