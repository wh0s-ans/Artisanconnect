import fs from 'fs';

const enPath = 'src/locales/en.json';
const arPath = 'src/locales/ar.json';

// Fix en.json: remove " (EN)" suffix from all auto values and translate meaningful keys
let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const enTranslations = {
  'artisanconnect': 'ArtisanConnect',
  'retour': 'Back',
  'deconnexion': 'Sign out',
  'profil': 'Profile',
  'informations': 'Information',
  'email': 'Email',
  'mot-de-passe': 'Password',
  'connexion': 'Signing in...',
  'creer-mon-compte': 'Create my account',
  'creation-en-cours': 'Creating...',
  'se-connecter': 'Sign in',
  'deja-inscrit': 'Already registered?',
  'nom-complet': 'Full name',
  'profession': 'Profession',
  'ville-region': 'City / Region',
  'selectionner': 'Select...',
  'jean-dupont': 'John Smith',
  'jeanemailcom': 'john@email.com',
  'minimum-6-caracteres': 'Minimum 6 characters',
  'etape-1': 'Step 1',
  'etape-2': 'Step 2',
  'qui-etes-vous': 'Who are you?',
  'choisissez-votre-role-pour-per': 'Choose your role to personalize your experience',
  'je-suis-client': 'I am a Client',
  'je-recherche-des-artisans-qual': 'I am looking for qualified craftsmen for my projects',
  'je-suis-artisan': 'I am a Craftsman',
  'je-propose-mes-services-et-dev': 'I offer my services and grow my clientele',
  'remplissez-vos-informations-po': 'Fill in your information to create your account',
  'changer': '← Change',
  'en-vous-inscrivant-vous-accept': 'By signing up, you agree to our',
  'cgu': 'Terms of Service',
  'et-notre': 'and our',
  'politique-de-confidentialite': 'Privacy Policy',
  'note-excellence': 'Excellence Rating',
  'avis-clients': 'Client Reviews',
  'verifie': 'Verified',
  'voir-le-profil': 'View profile',
  'voir-profil': 'View profile',
  'avis': 'reviews)',
  'artisans-trouves': 'craftsmen found',
  'mieux-notes': 'Best rated',
  'plus-populaires': 'Most popular',
  'aucun-resultat': 'No results',
  'aucun-artisan-ne-correspond-a': 'No craftsman matches your search criteria.',
  'rechercher-un-artisan': 'Find a Craftsman',
  'recherche': 'Search',
  'metier-nom': 'Trade, name...',
  'ville': 'City',
  'categorie': 'Category',
  'toutes': 'All',
  'plomberie': 'Plumbing',
  'electricite': 'Electricity',
  'peinture': 'Painting',
  'maconnerie': 'Masonry',
  'menuiserie': 'Carpentry',
  'architecture': 'Architecture',
  'serrurerie': 'Locksmithing',
  'jardinage': 'Gardening',
  'chauffage': 'Heating',
  'nettoyage': 'Cleaning',
  'euroh': '€/h',
  'tableau-de-bord': 'Dashboard',
  'tableau-de-bord-artisan': 'Artisan Dashboard',
  'espace-professionnel': 'Professional Space',
  'espace-client': 'Client Space',
  'accedez-aux-missions-dexceptio': 'Access exceptional missions and build your reputation.',
  'gerez-vos-demandes-et-selectio': 'Manage your requests and select the best.',
  'publier-un-besoin': 'Publish a need',
  'nouveau-besoin': 'New need',
  'mes-demandes': 'My Requests',
  'mes-projets': 'My Projects',
  'mes-chantiers': 'My Sites',
  'mes-propositions': 'My Proposals',
  'mes-avis': 'My Reviews',
  'demandes-actives': 'Active Requests',
  'projets-clotures': 'Completed Projects',
  'demandes-en-cours-detude': 'Requests under review',
  'nouveaux-besoins-disponibles': 'Available new needs',
  'voir-tout': 'See all',
  'repondre': 'Reply',
  'maison': 'Profile',
  'editer-le-profil': 'Edit profile',
  'notifications': 'Notifications',
  'acces-non-autorise': 'Unauthorized access',
  'page-introuvable': 'Page not found',
  'retour-a-laccueil': 'Back to home',
  'page-precedente': 'Previous page',
  'select-language': 'Select Language',
  'francais': 'French',
  'english': 'English',
  'annuler': 'Cancel',
  'suivant': 'Next',
  'precedent': 'Back',
  'terminer': 'Finish',
  'envoyer-le-lien': 'Send link',
  'envoi-en-cours': 'Sending...',
  'rafraichir': 'Refresh',
  'partager': 'Share',
  'signaler': 'Report',
  'contact': 'Contact',
  'total': 'Total:',
  'chargement': 'Loading...',
  'voir': 'View',
  'actions': 'Actions',
  'statut': 'Status',
  'date': 'Date',
  'client': 'Client',
  'role': 'Role',
  'inscription': 'Registered',
  'rechercher': 'Search...',
  'supervision': 'Supervision',
  'espace-administrateur': 'Administrator Space',
  'utilisateurs': 'Users',
  'artisans': 'Craftsmen',
  'gestion-des-demandes': 'Request Management',
  'aucun-utilisateur': 'No users.',
  'utilisateur-artisan': 'User / Craftsman',
};

// Apply translations
for (const [key, val] of Object.entries(enTranslations)) {
  if (en.auto && en.auto[key] !== undefined) {
    en.auto[key] = val;
  }
}

// Remove "(EN)" suffix from remaining auto keys
for (const key in en.auto) {
  if (typeof en.auto[key] === 'string' && en.auto[key].endsWith(' (EN)')) {
    // Strip suffix and leave as is (French fallback is ok)
    en.auto[key] = en.auto[key].slice(0, -5);
  }
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
console.log('en.json cleaned and translated!');

// Fix ar.json: remove "(AR)" suffix
let ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
for (const key in ar.auto) {
  if (typeof ar.auto[key] === 'string' && ar.auto[key].endsWith(' (AR)')) {
    ar.auto[key] = ar.auto[key].slice(0, -5);
  }
}
// Set artisanconnect name
if (ar.auto) ar.auto['artisanconnect'] = 'ArtisanConnect';
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2));
console.log('ar.json cleaned!');
