import { useTranslation } from "@/app/i18n"
interface PageProps {
  params: {
    lng: string;
  }
}

export default async function Page({ params }: PageProps) {
  const { lng } = await params
  const { t } = await useTranslation(lng)
  return (
    <div>
      <span>
        {t('initText')}
      </span>
    </div>
  )
}