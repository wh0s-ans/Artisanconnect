import React from 'react';
import { useTranslation } from "react-i18next";

export default function Terms() {
    const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-editorial-fg mb-8">{t('auto.conditions-generales-dutilisat')}</h1>
      <div className="prose prose-sm md:prose-base text-editorial-muted max-w-none space-y-6">
        <p>{t('auto.derniere-mise-a-jour-24-mai-20')}</p>
        
        <h2 className="text-xl font-semibold text-editorial-fg mt-8">{t('auto.1-acceptation-des-conditions')}</h2>
        <p>{t('auto.en-accedant-et-en-utilisant-ce')}</p>

        <h2 className="text-xl font-semibold text-editorial-fg mt-8">{t('auto.2-description-du-service')}</h2>
        <p>{t('auto.artisanconnect-est-une-platefo')}</p>

        <h2 className="text-xl font-semibold text-editorial-fg mt-8">{t('auto.3-inscription-et-comptes')}</h2>
        <p>{t('auto.vous-devez-fournir-des-informa')}</p>

        <h2 className="text-xl font-semibold text-editorial-fg mt-8">{t('auto.4-obligations-des-artisans')}</h2>
        <p>{t('auto.les-artisans-sengagent-a-fourn')}</p>

        <h2 className="text-xl font-semibold text-editorial-fg mt-8">{t('auto.5-evaluations-et-avis')}</h2>
        <p>{t('auto.les-clients-peuvent-laisser-de')}</p>
      </div>
    </div>
  );
}
