const fs = require('fs');

// RequestsList
let reqList = fs.readFileSync('src/pages/RequestsList.tsx', 'utf8');
reqList = reqList.replace(/const MOCK_REQUESTS[ \s\S]*?\];\n\n/, '');
reqList = reqList.replace(/const displayedRequests = \(requests\.length > 0 \? requests : MOCK_REQUESTS\).filter\(req => !categoryFilter \|\| req.category === categoryFilter\);/, 
  'const displayedRequests = requests.filter(req => !categoryFilter || req.category === categoryFilter);');
reqList = reqList.replace(/\{requests\.length === 0 \? "Exemples de Missions" : "Missions Actuelles"\}/, '"Missions Actuelles"');
fs.writeFileSync('src/pages/RequestsList.tsx', reqList);
