import { useState, useEffect } from 'react'
import { ThemePicker, ns as themeNs } from 'shared/components/theme-picker/index.mjs'
import { LocalePicker, ns as localeNs } from 'shared/components/locale-picker/index.mjs'
import {
  CloseIcon,
  CommunityIcon,
  DesignIcon,
  DiscordIcon,
  DocsIcon,
  GithubIcon,
  HeartIcon,
  HelpIcon,
  HomeIcon,
  MenuIcon,
  RssIcon,
  SearchIcon,
  ShowcaseIcon,
  UserIcon,
  ThemeIcon,
  I18nIcon,
} from 'shared/components/icons.mjs'
import { Ribbon } from 'shared/components/ribbon.mjs'
import { WordMark } from 'shared/components/wordmark.mjs'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { ModalThemePicker } from 'shared/components/modal/theme-picker.mjs'

export const ns = [...new Set(['header', ...themeNs, ...localeNs])]

const MainMenu = () => <p>Main menu here</p>

const NavButton = ({ href, label, color, children, onClick = false, extraClasses = '' }) => {
  const className =
    'border-0 px-1 lg:px-4 text-base py-3 lg:py-4 text-center flex flex-col items-center 2xl:w-36 ' +
    `hover:bg-${color}-400 text-${color}-400 hover:text-neutral grow lg:grow-0 ${extraClasses}`
  const span = <span className="block font-bold hidden 2xl:block">{label}</span>

  return onClick ? (
    <button {...{ onClick, className }} title={label}>
      {children}
      {span}
    </button>
  ) : (
    <Link {...{ href, className }} title={label}>
      {children}
      {span}
    </Link>
  )
}

const NavSpacer = () => (
  <div className="hidden lg:block text-base lg:text-4xl font-thin opacity-30 px-0.5 lg:px-2">|</div>
)

const NavIcons = ({ app }) => {
  const { t } = useTranslation(['header'])
  const iconSize = 'h-6 w-6 lg:h-12 lg:w-12'

  return (
    <>
      <NavButton onClick={() => app.setModal(<MainMenu />)} label={t('header:menu')} color="red">
        <MenuIcon className={iconSize} />
      </NavButton>
      <NavSpacer />
      <NavButton href="/designs" label={t('header:designs')} color="orange">
        <DesignIcon className={iconSize} />
      </NavButton>
      <NavButton
        href="/showcase"
        label={t('header:showcase')}
        color="yellow"
        extraClasses="hidden lg:flex"
      >
        <ShowcaseIcon className={iconSize} />
      </NavButton>
      <NavButton href="/docs" label={t('header:docs')} color="lime" extraClasses="hidden lg:flex">
        <DocsIcon className={iconSize} />
      </NavButton>
      <NavButton href="/blog" label={t('header:blog')} color="green" extraClasses="hidden lg:flex">
        <RssIcon className={iconSize} />
      </NavButton>
      <NavButton
        href="/community"
        label={t('header:community')}
        color="cyan"
        extraClasses="hidden lg:flex"
      >
        <CommunityIcon className={iconSize} />
      </NavButton>
      <NavSpacer />
      <NavButton
        onClick={() => app.setModal(<ModalThemePicker app={app} />)}
        label={t('header:theme')}
        color="blue"
      >
        <ThemeIcon className={iconSize} />
      </NavButton>
      <NavButton href="/patrons/join" label={t('header:language')} color="indigo">
        <I18nIcon className={iconSize} />
      </NavButton>
      <NavButton onClick={() => setSearch(true)} label={t('header:search')} color="violet">
        <SearchIcon className={iconSize} />
      </NavButton>
      <NavSpacer />
      <NavButton href="/account" label={t('header:account')} color="purple">
        <UserIcon className={iconSize} />
      </NavButton>
    </>
  )
}

export const Header = ({ app, setSearch }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const curScrollPos = typeof window !== 'undefined' ? window.pageYOffset : 0
        if (curScrollPos >= prevScrollPos) {
          if (show && curScrollPos > 20) setShow(false)
        } else setShow(true)
        setPrevScrollPos(curScrollPos)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollPos, show])

  return (
    <header
      className={`
      fixed bottom-0 lg:bottom-auto lg:top-0 left-0
      bg-neutral
      w-full
      z-30
      transition-transform
      ${
        show || app.state.loading
          ? ''
          : 'fixed bottom-0 lg:top-0 left-0 translate-y-36 lg:-translate-y-36'
      }
      drop-shadow-xl
    `}
    >
      <div className="m-auto md:px-8">
        <div className="p-0 flex flex-row gap-2 justify-between text-neutral-content items-center">
          {/* Non-mobile content */}
          <div className="hidden lg:flex lg:px-2 flex-row items-center justify-center w-full">
            <NavIcons app={app} />
          </div>

          {/* Mobile content */}
          <div className="flex lg:hidden flex-row items-center justify-between w-full">
            <NavIcons />
          </div>
        </div>
      </div>
      <Ribbon loading={app.state.loading} theme={app.theme} />
    </header>
  )
}
