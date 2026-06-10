import React from 'react';
import { useTranslation } from "react-i18next";

export default function Privacy() {
    const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-editorial-fg mb-8">{t('auto.politique-de-confidentialite')}</h1>
      <div className="prose prose-sm md:prose-base text-editorial-muted max-w-none space-y-6">
        <p>{t('auto.derniere-mise-a-jour-24-mai-20')}</p>
        
        <h2 className="text-xl font-semibold text-editorial-fg mt-8">{t('auto.1-collecte-des-donnees')}</h2>
        <p>{t('auto.nous-collectons-les-informatio')}</p>

        <h2 className="text-xl font-semibold text-editorial-fg mt-8">{t('auto.2-utilisation-des-donnees')}</h2>
        <p>{t('auto.vos-donnees-sont-utilisees-pou')}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('auto.fournir-maintenir-et-ameliorer')}</li>
          <li>{t('auto.faciliter-la-mise-en-relation')}</li>
          <li>{t('auto.vous-envoyer-des-notifications')}</li>
          <li>{t('auto.assurer-la-securite-de-la-plat')}</li>
        </ul>

        <h2 className="text-xl font-semibold text-editorial-fg mt-8">{t('auto.3-partage-des-informations')}</h2>
        <p>{t('auto.nous-ne-vendons-pas-vos-donnee')}</p>

        <h2 className="text-xl font-semibold text-editorial-fg mt-8">{t('auto.4-vos-droits')}</h2>
        <p>{t('auto.conformement-au-rgpd-vous-disp')}</p>
        
        <h2 className="text-xl font-semibold text-editorial-fg mt-8">{t('auto.5-cookies')}</h2>
        <p>{t('auto.nous-utilisons-des-cookies-pou')}</p>
      </div>
    </div>
  );
}
