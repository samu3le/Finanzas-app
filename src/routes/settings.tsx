import { createFileRoute, Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Badge, Card, PageHeader, Segmented, SectionTitle } from '@/components/ui'
import { REPORT_CURRENCY } from '@/domain/money'
import { type ThemePref, useTheme } from '@/lib/theme'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

const THEMES: readonly { value: ThemePref; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
]

function SettingsPage() {
  const [theme, setTheme] = useTheme()

  return (
    <>
      <PageHeader title="Ajustes" />
      <div className="space-y-6">
        <section>
          <SectionTitle>Apariencia</SectionTitle>
          <Card className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">Tema</p>
              <p className="text-sm text-muted">Sistema sigue el modo de tu dispositivo.</p>
            </div>
            <Segmented label="Tema" options={THEMES} value={theme} onChange={setTheme} />
          </Card>
        </section>

        <section>
          <SectionTitle>Monedas</SectionTitle>
          <Card className="divide-y divide-border py-1">
            <Row label="Moneda de reportes" value={<span className="font-medium">{REPORT_CURRENCY}</span>} />
            <Row label="Monedas de pago" value={<span className="font-medium">COP · VES</span>} />
          </Card>
        </section>

        <section>
          <SectionTitle>Sincronización</SectionTitle>
          <Card className="divide-y divide-border py-1">
            <Row label="Cuenta" value={<Badge>Sin conectar</Badge>} />
            <Row label="Datos" value={<span className="text-sm text-muted">Guardados en este dispositivo</span>} />
          </Card>
        </section>

        <section>
          <SectionTitle>Diseño</SectionTitle>
          <Card className="py-1">
            <Link to="/design" className="flex items-center justify-between gap-3 py-3 hover:text-accent">
              <span>Guía de estilos y componentes</span>
              <span aria-hidden className="text-muted">›</span>
            </Link>
          </Card>
        </section>
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span>{label}</span>
      {value}
    </div>
  )
}
