// Rendered by Next while the server-side property fetch is pending — a skeleton
// that mirrors the detail layout (gallery + two-column body).
export default function PropertyDetailLoading() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="mb-6 h-4 w-24 animate-pulse rounded-xsm bg-sterling" />

      {/* Gallery */}
      <div className="aspect-[16/9] w-full animate-pulse rounded-md bg-sterling" />
      <div className="mt-3 flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-16 w-24 flex-none animate-pulse rounded-sm bg-sterling" />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="h-6 w-28 animate-pulse rounded-pill bg-sterling" />
          <div className="mt-3 h-12 w-3/4 animate-pulse rounded-xsm bg-sterling" />
          <div className="mt-3 h-4 w-2/5 animate-pulse rounded-xsm bg-sterling" />

          <div className="mt-8 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-xsm bg-sterling" />
            <div className="h-4 w-11/12 animate-pulse rounded-xsm bg-sterling" />
            <div className="h-4 w-4/5 animate-pulse rounded-xsm bg-sterling" />
          </div>

          <div className="mt-10 space-y-4">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="h-32 w-full animate-pulse rounded-md bg-sterling" />
            ))}
          </div>
        </div>

        <div className="h-48 w-full animate-pulse rounded-md bg-sterling" />
      </div>
    </main>
  )
}
