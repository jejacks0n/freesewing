// Dependencies
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
// Hooks
import { useAccount } from 'shared/hooks/use-account.mjs'
import { useBackend } from 'shared/hooks/use-backend.mjs'
import { useLoadingStatus, ns as statusNs } from 'shared/hooks/use-loading-status.mjs'
// Components
import { BackToAccountButton, NumberBullet } from './shared.mjs'
import { ListInput } from 'shared/components/inputs.mjs'
import { DynamicOrgDocs } from 'shared/components/dynamic-docs/org.mjs'
// Config
import { siteConfig as conf } from 'site/site.config.mjs'

export const ns = ['account', 'locales', statusNs]

export const LanguageSettings = () => {
  // Hooks
  const { account, setAccount } = useAccount()
  const { setLoadingStatus, LoadingStatus } = useLoadingStatus()
  const backend = useBackend()
  const { t, i18n } = useTranslation(ns)

  // State
  const [language, setLanguage] = useState(account.language || 'en')

  // Helper method to update the account
  const update = async (lang) => {
    if (lang !== language) {
      setLoadingStatus([true, 'processingUpdate'])
      setLanguage(lang)
      const result = await backend.updateAccount({ language: lang })
      if (result.success) {
        setAccount(result.data.account)
        setLoadingStatus([true, 'settingsSaved', true, true])
      } else setLoadingStatus([true, 'backendError', true, true])
    }
  }

  return (
    <div className="max-w-xl">
      <LoadingStatus />
      <ListInput
        id="account-language"
        label={t('languageTitle')}
        list={conf.languages.map((val) => ({
          val,
          label: (
            <div className="flex flex-row items-center w-full justify-between">
              <span>
                {t(`locales:${val}`)}
                <span className="px-2 opacity-50">|</span>
                {t(`locales:${val}`, { lng: val })}
              </span>
              <NumberBullet nr={val} color="secondary" />
            </div>
          ),
          desc: t('languageTitle', { lng: val }),
        }))}
        current={language}
        update={update}
        docs={<DynamicOrgDocs language={i18n.language} path={`site/account/language`} />}
      />
      <BackToAccountButton />
    </div>
  )
}
