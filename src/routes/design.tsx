import { createFileRoute } from '@tanstack/react-router'
import { type ReactNode, useEffect, useState } from 'react'
import { BarChart, DonutChart, StatTile } from '@/components/charts'
import { Button, Checkbox, Field, MoneyInput, Select, Switch, Textarea, TextInput } from '@/components/form'
import { Accordion, Alert, Avatar, Badge, Card, Carousel, Dialog, EmptyState, Meter, PageHeader, SectionTitle, Segmented, Skeleton } from '@/components/ui'
import { formatMinor } from '@/lib/format'
import { compact } from '@/lib/scale'
import { type ThemePref, useTheme } from '@/lib/theme'

export const Route = createFileRoute('/design')({
  component: DesignPage,
})

const TOKEN_GROUPS = [
  { title: 'Superficies', tokens: ['bg', 'surface', 'surface-2', 'border'] },
  { title: 'Texto', tokens: ['fg', 'muted'] },
  { title: 'Marca', tokens: ['accent', 'accent-soft', 'on-accent'] },
  { title: 'Estado', tokens: ['positive', 'negative', 'warning'] },
  { title: 'Gráficos (orden fijo)', tokens: ['series-1', 'series-2', 'series-3', 'series-4', 'series-5'] },
] as const

const THEMES: readonly { value: ThemePref; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
]

const MONTHS = [
  { label: 'May', value: 41200 },
  { label: 'Jun', value: 38650 },
  { label: 'Jul', value: 52300 },
  { label: 'Ago', value: 46800 },
  { label: 'Sep', value: 39900 },
  { label: 'Oct', value: 44150 },
]

const CATEGORIES = [
  { label: 'Comida', value: 15200 },
  { label: 'Transporte', value: 6400 },
  { label: 'Servicios', value: 9800 },
  { label: 'Salidas', value: 7300 },
  { label: 'Salud', value: 2900 },
  { label: 'Hogar', value: 1700 },
  { label: 'Regalos', value: 850 },
]

const usd = (minor: number) => formatMinor(minor, 'USD')

/** Living style guide: every block renders the real components with the current theme. */
function DesignPage() {
  const [theme, setTheme] = useTheme()
  const [dialog, setDialog] = useState(false)
  const [segment, setSegment] = useState<'usd' | 'native'>('usd')
  const hex = useTokenValues(theme)

  return (
    <>
      <PageHeader title="Design system" subtitle="Guía de estilos" action={<Segmented label="Tema" options={THEMES} value={theme} onChange={setTheme} />} />

      <div className="space-y-10">
        <Block title="Paleta">
          <p className="mb-4 text-sm text-muted">
            Claro: grises fríos y sobrios. Oscuro: fondo gris oscuro azulado. Los componentes solo usan estos tokens (<code>bg-surface</code>,{' '}
            <code>text-muted</code>…), así cada modo cambia en un solo sitio: <code>src/index.css</code>.
          </p>
          <div className="space-y-5">
            {TOKEN_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-sm font-medium">{group.title}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {group.tokens.map((token) => (
                    <div key={token} className="overflow-hidden rounded-xl border border-border bg-surface">
                      <div className="h-14 border-b border-border" style={{ background: `var(--${token})` }} />
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium">{token}</p>
                        <p className="text-xs text-muted uppercase tabular-nums">{hex[token] ?? '…'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Tipografía">
          <Card className="space-y-3">
            <p className="text-3xl font-semibold tracking-tight">$1.240,50 · Cifra principal</p>
            <p className="text-2xl font-semibold tracking-tight">Título de página</p>
            <p className="text-lg font-semibold">Título de diálogo</p>
            <p className="font-medium">Texto destacado / filas de lista</p>
            <p>Texto base para descripciones y contenido.</p>
            <p className="text-sm text-muted">Texto secundario, ayudas y fechas.</p>
            <p className="text-xs font-semibold tracking-wider text-muted uppercase">Etiqueta de sección</p>
          </Card>
        </Block>

        <Block title="Botones">
          <Card className="flex flex-wrap items-center gap-3">
            <Button>Guardar</Button>
            <Button variant="secondary">Cancelar</Button>
            <Button variant="ghost">Ver más</Button>
            <Button variant="danger">Eliminar</Button>
            <Button size="sm">Pequeño</Button>
            <Button disabled>Deshabilitado</Button>
          </Card>
        </Block>

        <Block title="Inputs">
          <Card className="grid gap-4 md:grid-cols-2">
            <Field label="Descripción" hint="Aparece en la lista de movimientos.">
              {(props) => <TextInput placeholder="Ej. Mercado del sábado" {...props} />}
            </Field>
            <Field label="Cuenta" error="Elige una cuenta para continuar.">
              {(props) => (
                <Select defaultValue="" {...props}>
                  <option value="" disabled>
                    Selecciona…
                  </option>
                  <option>Bancolombia · COP</option>
                  <option>Banesco · VES</option>
                </Select>
              )}
            </Field>
            <div className="space-y-3 md:col-span-2">
              <Segmented
                label="Modo de captura"
                options={[
                  { value: 'usd', label: 'Escribo en $' },
                  { value: 'native', label: 'Escribo en Bs' },
                ]}
                value={segment}
                onChange={setSegment}
              />
              <Field label={segment === 'usd' ? 'Monto en dólares' : 'Monto en bolívares'} hint="Tasa BCV € · 1 $ = 52,31 Bs · congelada al guardar">
                {(props) => <MoneyInput currency={segment === 'usd' ? 'USD' : 'Bs'} {...props} />}
              </Field>
            </div>
            <Field label="Nota">{(props) => <Textarea placeholder="Opcional" {...props} />}</Field>
            <div className="space-y-2">
              <Checkbox label="Excluir al pagador de la división" />
              <Switch label="Marcar tasa como manual (P2P)" defaultChecked />
            </div>
          </Card>
        </Block>

        <Block title="Selección y etiquetas">
          <Card className="flex flex-wrap items-center gap-3">
            <Segmented
              label="Filtro"
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'expense', label: 'Gastos' },
                { value: 'income', label: 'Ingresos' },
              ]}
              value="all"
              onChange={() => {}}
            />
            <Badge tone="accent">Abierta</Badge>
            <Badge>Liquidada</Badge>
            <Badge tone="accent">COP</Badge>
            <span className="flex items-center gap-2">
              <Avatar name="Juan Pérez" size="sm" />
              <Avatar name="Ana" size="sm" />
              <Avatar name="Yo" />
            </span>
          </Card>
        </Block>

        <Block title="Alertas">
          <div className="grid gap-3 md:grid-cols-2">
            <Alert title="Sin conexión">Tus cambios se guardan aquí y se sincronizan al volver la red.</Alert>
            <Alert tone="warning" title="Tasa desactualizada">La última tasa BCV es de ayer. Puedes editarla a mano.</Alert>
            <Alert tone="error" title="No se pudo guardar">El monto supera el saldo disponible.</Alert>
            <Alert tone="success" title="Actividad liquidada">Todas las deudas quedaron en cero.</Alert>
          </div>
        </Block>

        <Block title="Acordeón">
          <Accordion
            items={[
              { title: '¿Qué tasa se usa en COP?', content: 'La TRM oficial del día, consultada a las 07:00 y 19:00 hora Colombia.' },
              { title: '¿Cómo se divide un gasto?', content: 'En partes iguales entre los participantes elegidos; los centavos sobrantes van en orden fijo.' },
              { title: '¿Puedo usar la app sin internet?', content: 'Sí. Todo se guarda en el dispositivo y se sincroniza al volver la conexión.' },
            ]}
          />
        </Block>

        <Block title="Carrusel">
          <Carousel label="Cuentas">
            {[
              { name: 'Bancolombia', currency: 'COP', amount: formatMinor(285000000, 'COP') },
              { name: 'Banesco', currency: 'VES', amount: formatMinor(1845000, 'VES') },
              { name: 'Efectivo', currency: 'COP', amount: formatMinor(32000000, 'COP') },
              { name: 'Binance', currency: 'VES', amount: formatMinor(520000, 'VES') },
            ].map((account) => (
              <Card key={account.name} className="h-full">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{account.name}</p>
                  <Badge tone="accent">{account.currency}</Badge>
                </div>
                <p className="mt-6 text-2xl font-semibold tracking-tight">{account.amount}</p>
                <p className="text-sm text-muted">Saldo actual</p>
              </Card>
            ))}
          </Carousel>
        </Block>

        <Block title="Gráficos">
          <div className="grid gap-4 md:grid-cols-3">
            <StatTile label="Gastos de octubre" value={usd(44150)} delta={{ text: '10,6 % vs. sept.', good: false }} trend={MONTHS.map((m) => m.value)} />
            <StatTile label="Ingresos de octubre" value={usd(120000)} delta={{ text: 'igual que sept.', good: true }} />
            <Card>
              <p className="text-sm text-muted">Mi parte en «Salida del sábado»</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{usd(3000)}</p>
              <div className="mt-3">
                <Meter value={3000} max={9000} label="Mi parte sobre el total" />
              </div>
              <p className="mt-1.5 text-xs text-muted">de {usd(9000)} en total</p>
            </Card>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <SectionTitle>Gastos por mes · USD</SectionTitle>
              <BarChart data={MONTHS} format={usd} tick={(v) => compact(v / 100)} label="Gastos por mes en USD" />
            </Card>
            <Card>
              <SectionTitle>Gastos por categoría · USD</SectionTitle>
              <DonutChart data={CATEGORIES} format={usd} label="Gastos por categoría en USD" />
            </Card>
          </div>
        </Block>

        <Block title="Estados">
          <div className="grid gap-4 md:grid-cols-2">
            <EmptyState title="Sin movimientos" hint="Cuando registres gastos e ingresos, los verás aquí." />
            <Card className="space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </Card>
          </div>
        </Block>

        <Block title="Diálogo">
          <Button variant="secondary" onClick={() => setDialog(true)}>
            Abrir diálogo
          </Button>
          <Dialog open={dialog} onClose={() => setDialog(false)} title="Nuevo gasto">
            <div className="space-y-4">
              <Field label="Monto">{(props) => <MoneyInput currency="COP" {...props} />}</Field>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setDialog(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={() => setDialog(false)}>
                  Guardar
                </Button>
              </div>
            </div>
          </Dialog>
          <p className="mt-2 text-sm text-muted">Hoja inferior en teléfonos, centrado desde tablet.</p>
        </Block>
      </div>
    </>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

/** Reads the resolved hex of each token so the swatches always show the active theme. */
function useTokenValues(theme: ThemePref) {
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement)
      setValues(Object.fromEntries(TOKEN_GROUPS.flatMap((g) => g.tokens).map((t) => [t, style.getPropertyValue(`--${t}`).trim()])))
    }
    read()
    const media = matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', read)
    return () => media.removeEventListener('change', read)
  }, [theme])
  return values
}
