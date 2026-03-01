const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function run(file) {
    const parser = new PDFParse();
    const data = await parser.parse(fs.readFileSync(file));
    console.log(`\n=== ${file} (${data.numpages} pages) ===`);
    console.log(data.text.substring(0, 3000));
}

run('vocab1.pdf').then(() => run('vocab2.pdf')).catch(console.error);
