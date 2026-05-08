const fs = require('fs');
const path = require('path');

const files = [
  'd:/My Folders/Major Project - SMA/Major-SMA/frontend/src/pages/Home.jsx',
  'd:/My Folders/Major Project - SMA/Major-SMA/frontend/src/pages/AboutUs.jsx',
  'd:/My Folders/Major Project - SMA/Major-SMA/frontend/src/pages/Contact.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  // strip dark:xxx classes
  content = content.replace(/dark:[^\s"']+/g, '');
  // cleanup multiple spaces
  content = content.replace(/ {2,}/g, ' ');
  // cleanup spaces before quotes
  content = content.replace(/ "/g, '"');
  fs.writeFileSync(file, content, 'utf-8');
  console.log(`Processed ${file}`);
});
