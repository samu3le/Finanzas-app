import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { Badge, Card, EmptyState, PageHeader, SectionTitle } from '@/components/ui'
import { db } from '@/db/db'
import type { Activity } from '@/db/types'
import { formatDay } from '@/lib/format'

export const Route = createFileRoute('/activities')({
  component: ActivitiesPage,
})

function ActivitiesPage() {
  const activities = useLiveQuery(() => db.activities.orderBy('occurredOn').reverse().filter((a) => !a.deletedAt).toArray(), [])
  const participants = useLiveQuery(() => db.activityParticipants.filter((p) => !p.deletedAt).toArray(), [])

  const countByActivity = new Map<string, number>()
  for (const p of participants ?? []) countByActivity.set(p.activityId, (countByActivity.get(p.activityId) ?? 0) + 1)

  const open = activities?.filter((a) => a.status === 'open') ?? []
  const settled = activities?.filter((a) => a.status === 'settled') ?? []

  return (
    <>
      <PageHeader title="Actividades" />

      {activities && activities.length === 0 ? (
        <EmptyState
          title="Sin actividades"
          hint="Una salida, un viaje o una cena: registra quién pagó cada gasto y la app calcula cuánto debe cada uno y a quién."
        />
      ) : (
        <div className="space-y-8">
          <ActivityGroup title="Abiertas" items={open} counts={countByActivity} />
          <ActivityGroup title="Liquidadas" items={settled} counts={countByActivity} />
        </div>
      )}
    </>
  )
}

function ActivityGroup({ title, items, counts }: { title: string; items: Activity[]; counts: Map<string, number> }) {
  if (items.length === 0) return null
  return (
    <section>
      <SectionTitle>{title}</SectionTitle>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((activity) => (
          <Card key={activity.id}>
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{activity.name}</p>
              <Badge tone={activity.status === 'open' ? 'accent' : 'muted'}>{activity.status === 'open' ? 'Abierta' : 'Liquidada'}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              {formatDay(activity.occurredOn)} · {counts.get(activity.id) ?? 0} participantes
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}
