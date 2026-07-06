const fs = require('fs');
const html = fs.readFileSync('c:/DARKO/KalkulacijaPetric/TENOVIS.html', 'utf8');
const lines = html.split('\n');
const start = lines.findIndex(l => l.includes('async function saveProjectToFile()'));
const end = lines.findIndex((l, i) => i > start && l.includes('async function exportToFile()'));
console.log('Function length:', end - start);
const fn = lines.slice(start, end).join('\n');
if (fn.includes('const jsonStr = JSON.stringify(data, null, 2);')) {
    console.log('stringify is present');
} else {
    console.log('stringify is MISSING!');
}
