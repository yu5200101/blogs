import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import siteMetadata from '@/data/siteMetadata'
import type { OptionsParams } from './type'

const { fallbackLanguage, languages } = siteMetadata

const initI18next = async (lng = fallbackLanguage, ns = 'basic') => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init({
      // debug: true,
      supportedLngs: languages,
      fallbackLng: fallbackLanguage,
      lng,
      fallbackNS: 'basic',
      defaultNS: 'basic',
      ns
    })
  return i18nInstance
}

export async function useTranslation(lng: string, ns?: string, options?: OptionsParams) {
  const i18nextInstance = await initI18next(lng, ns)
  const { keyPrefix = '' } = options || { keyPrefix: '' }
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, keyPrefix),
    i18n: i18nextInstance
  }
}