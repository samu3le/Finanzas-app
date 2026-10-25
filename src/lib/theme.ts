import { useState } from 'react'

export type ThemePref = 'system' | 'light' | 'dark'

const KEY = 'theme'
// Keep in sync with --bg in index.css and the theme-color metas in index.html.
const THEME_COLOR = { light: '#f4f5f7', dark: '#1a202b' } as const

function read(): ThemePref {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

function apply(pref: ThemePref) {
  const root = document.documentElement
  if (pref === 'system') root.removeAttribute('data-theme')
  else root.dataset.theme = pref
  // Two metas (one per prefers-color-scheme); an explicit choice overrides both.
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const scheme = meta.media.includes('dark') ? 'dark' : 'light'
    meta.content = THEME_COLOR[pref === 'system' ? scheme : pref]
  })
}

export function useTheme() {
  const [pref, setPref] = useState(read)
  const set = (next: ThemePref) => {
    try {
      if (next === 'system') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, next)
    } catch {
      // ponytail: storage blocked (private mode) → choice lasts only this session
    }
    apply(next)
    setPref(next)
  }
  return [pref, set] as const
}
