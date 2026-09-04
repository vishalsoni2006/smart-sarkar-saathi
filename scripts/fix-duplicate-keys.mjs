import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/lib/i18n/translations.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace any occurrences of step1Heading followed by step1Desc with wizardStep1Desc
content = content.replace(/step1Heading:\s*("[^"]+"|'[^']+'),\s*step1Desc:/g, (match) => {
  return match.replace('step1Desc:', 'wizardStep1Desc:');
});

content = content.replace(/step2Heading:\s*("[^"]+"|'[^']+'),\s*step2Desc:/g, (match) => {
  return match.replace('step2Desc:', 'wizardStep2Desc:');
});

content = content.replace(/step3Heading:\s*("[^"]+"|'[^']+'),\s*step3Desc:/g, (match) => {
  return match.replace('step3Desc:', 'wizardStep3Desc:');
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed duplicate keys in translations.ts');
