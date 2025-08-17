'use client';
import { useTranslation } from '@/app/i18n/client'

export default function Like({lng}: {lng: string}) {

  const { t } = useTranslation(lng, 'basic')
  return (
    <button>{t('like')}</button>
  )
}