const fs = require('fs');
let c = fs.readFileSync('src/pages/SignupPage.tsx', 'utf8');

c = c.replace(/const \[companyName, setCompanyName\] = useState\(''\);\s*const \[companyId, setCompanyId\] = useState\(''\);/, '');
c = c.replace(/if \(role === 'artisan'\) \{ Object\.assign\(userData, \{ profession, companyName, companyId \}\); \}/, "if (role === 'artisan') { Object.assign(userData, { profession }); }");

const htmlRegex = /<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 text-editorial-fg mt-8">\s*<div className="space-y-2">\s*<label className="text-sm text-editorial-accent font-bold">Nom de l'entreprise \(Optionnel\)<\/label>\s*<input[^>]+\/>\s*<\/div>\s*<div className="space-y-2">\s*<label className="text-sm text-editorial-accent font-bold">SIRET \(Optionnel\)<\/label>\s*<input[^>]+\/>\s*<\/div>\s*<\/div>/;

c = c.replace(htmlRegex, '');

fs.writeFileSync('src/pages/SignupPage.tsx', c);
