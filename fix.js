const fs = require('fs');

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = "'Assessment Allow List',\n                                   ]";
const repStr = "'Assessment Allow List',\n                                     'Data Collection',\n                                   ]";

content = content.replace(/'Assessment Allow List',\n\s*\]\.filter/g, "'Assessment Allow List',\n                                     'Data Collection',\n                                   ].filter");

content = content.replace(/activeSubModule === 'Assessment Allow List' \? \(\n\s*<AssessmentAllowList \/>\n\s*\) : activeSubModule === 'Manual/g, "activeSubModule === 'Assessment Allow List' ? (\n                    <AssessmentAllowList />\n                  ) : activeSubModule === 'Data Collection' ? (\n                    <div>Data Collection Page</div>\n                  ) : activeSubModule === 'Manual");

fs.writeFileSync(path, content, 'utf8');
console.log('done');
