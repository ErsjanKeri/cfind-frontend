"use client"

export function StatsSection() {
  const stats = [
    { label: "Verified Listings", value: "120+" },
    { label: "Licensed Agents", value: "45" },
    { label: "Successful Deals", value: "280+" },
    { label: "Total Value", value: "€42M+" },
  ]

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
