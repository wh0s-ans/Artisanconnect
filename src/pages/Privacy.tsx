import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-editorial-fg mb-8">Politique de Confidentialité</h1>
      <div className="prose prose-sm md:prose-base text-editorial-muted max-w-none space-y-6">
        <p>Dernière mise à jour : 24 Mai 2026</p>
        
        <h2 className="text-xl font-semibold text-editorial-fg mt-8">1. Collecte des données</h2>
        <p>Nous collectons les informations que vous nous fournissez directement, telles que votre nom, adresse email, numéro de téléphone, et les détails de vos projets ou profil artisan.</p>

        <h2 className="text-xl font-semibold text-editorial-fg mt-8">2. Utilisation des données</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Fournir, maintenir et améliorer nos services</li>
          <li>Faciliter la mise en relation entre clients et artisans</li>
          <li>Vous envoyer des notifications liées à votre compte ou à vos projets</li>
          <li>Assurer la sécurité de la plateforme</li>
        </ul>

        <h2 className="text-xl font-semibold text-editorial-fg mt-8">3. Partage des informations</h2>
        <p>Nous ne vendons pas vos données personnelles. Les informations des clients sont partagées avec les artisans uniquement lorsque le client demande un devis ou initie un contact.</p>

        <h2 className="text-xl font-semibold text-editorial-fg mt-8">4. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données personnelles. Vous pouvez exercer ces droits en nous contactant.</p>
        
        <h2 className="text-xl font-semibold text-editorial-fg mt-8">5. Cookies</h2>
        <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut limiter certaines fonctionnalités.</p>
      </div>
    </div>
  );
}
