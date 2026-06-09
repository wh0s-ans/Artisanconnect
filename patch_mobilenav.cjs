const fs = require('fs');
let c = fs.readFileSync('src/components/MobileNav.tsx', 'utf8');

c = c.replace(/\{userData\?\.role === 'admin' && <MobileNavItem to="\/admin" icon={<ShieldAlert \/>} label="Admin" \/>\}/g, '');

const searchFor = '<MobileNavItem to="/dashboard" icon={<LayoutDashboard />} label="Tableau de bord" />';
const replaceWith = '<MobileNavItem to="/dashboard" icon={<LayoutDashboard />} label="Tableau de bord" />\\n <div className="hidden">{userData?.role}</div>{userData?.role === "admin" && <MobileNavItem to="/admin" icon={<ShieldAlert />} label="Admin" />}';

// doing it globally
c = c.split(searchFor).join(replaceWith);

fs.writeFileSync('src/components/MobileNav.tsx', c.replace(/<div className="hidden">\{userData\?\.role\}<\/div>/g, ''));
