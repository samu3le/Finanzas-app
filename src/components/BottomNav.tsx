import { Link } from '@tanstack/react-router'

// 24×24 outline icons (Lucide paths), stroke uses currentColor.
const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  settings: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
} as const

const ITEMS = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/transactions', label: 'Movimientos', icon: 'list' },
  { to: '/activities', label: 'Actividades', icon: 'users' },
  { to: '/settings', label: 'Ajustes', icon: 'settings' },
] as const

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONS[name]} />
    </svg>
  )
}

/** Bottom tab bar on phones (< md), sidebar from md (tablet and desktop). */
export function BottomNav() {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:inset-y-0 md:right-auto md:w-56 md:border-t-0 md:border-r md:bg-surface md:pb-0 md:pt-[max(1.5rem,env(safe-area-inset-top))]"
    >
      <div className="hidden items-center gap-2.5 px-5 pb-6 md:flex">
        <img src="/logo.svg" alt="" className="size-8 rounded-lg" />
        <span className="font-semibold tracking-tight">Finanzas</span>
      </div>
      <ul className="mx-auto grid max-w-md grid-cols-4 md:max-w-none md:grid-cols-1 md:gap-1 md:px-3">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted transition-colors hover:text-fg md:flex-row md:gap-3 md:rounded-lg md:px-3 md:py-2 md:text-sm"
              activeProps={{ className: 'text-accent! md:bg-accent-soft' }}
              activeOptions={{ exact: item.to === '/' }}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
