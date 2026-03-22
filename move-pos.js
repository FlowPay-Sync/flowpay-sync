const fs = require('fs');
let content = fs.readFileSync('app/demo/page.tsx', 'utf8');

const posStart = content.indexOf('            {/* POS Simulation */}');
const examplesStart = content.indexOf('            {/* Examples */}');

if (posStart !== -1 && examplesStart !== -1 && posStart < examplesStart) {
  const posBlock = content.slice(posStart, examplesStart);
  content = content.slice(0, posStart) + content.slice(examplesStart);
  
  const injectRegex = /\s*<\/div>\s*<\/div>\s*<\/main>/;
  const match = content.match(injectRegex);
  
  if (match) {
    content = content.slice(0, match.index) + '\n\n' + posBlock + content.slice(match.index);
    fs.writeFileSync('app/demo/page.tsx', content);
    console.log('Successfully moved POS block.');
  } else {
    console.log('Injection point not found');
  }
} else {
  console.log('Indices not found or invalid');
}
