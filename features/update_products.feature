import fs from 'fs';
import zlib from 'zlib';
import request from 'request';
import filterProperties from './filterProperties.js';

// download the file
const URL = 'http://challenges.coode.sh/food/data/json/products_02.json.gz';
request(URL).pipe(fs.createWriteStream('products_02.json.gz'));

const uri = 'products_02.json.gz';
const filePath = './dist/products_02.json';


// unzip the file
fs.createReadStream(uri)
  .pipe(zlib.createUnzip())
  .pipe(fs.createWriteStream('products_02.json'));


// read the file
var stream = fs.createReadStream(filePath, {flags: 'r', encoding: 'utf-8'});
var buf = '';
let count = 0;

stream.on('data', function(d) {
    buf += d.toString(); // when data is read, stash it in a string buffer
    pump(); // then process the buffer
});

function pump() {
    var pos;

    while ((pos = buf.indexOf('\n')) >= 0) { // keep going while there's a newline somewhere in the buffer
        if (pos == 0) { // if there's more than one newline in a row, the buffer will now start with a newline
            buf = buf.slice(1); // discard it
            continue; // so that the next iteration will start with data
        }
        count++;
        processLine(buf.slice(0,pos)); // hand off the line
        buf = buf.slice(pos+1); // and slice the processed data off the buffer
        if(count >= 3) {
          stream.pause();
          break;

        }
    }
}

function processLine(line) {
    if (line[line.length-1] == '\r') line=line.substr(0,line.length-1);

    if (line.length > 0) {
        var obj = JSON.parse(line); // parse the JSON
        const parseObj = filterProperties(obj);
        parseObj.imported_t = new Date().getUTCSeconds();
        parseObj.status = 'draft';
        console.log(parseObj);
    }
}