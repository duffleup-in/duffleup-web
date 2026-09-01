// Rendered by Next while the server-side property fetch is pending — a skeleton
// that mirrors the detail layout (dark masthead + gallery + two-column body).
export default function PropertyDetailLoading() {
  return (
    <>
      {/* Dark masthead — mirrors PropertyDetailView so there's no shift. */}
      <div className="bg-pitch pb-10 pt-[120px] text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-6 h-4 w-24 animate-pulse rounded-xsm bg-white/15" />
          <div className="h-6 w-28 animate-pulse rounded-pill bg-white/15" />
          <div className="mt-3 h-12 w-3/4 max-w-md animate-pulse rounded-xsm bg-white/15" />
          <div className="mt-3 h-4 w-2/5 max-w-xs animate-pulse rounded-xsm bg-white/15" />
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-10">
        {/* Gallery */}
        <div className="aspect-[16/9] w-full animate-pulse rounded-md bg-sterling" />
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-16 w-24 flex-none animate-pulse rounded-sm bg-sterling" />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="space-y-3">
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
      </div>
    </>
  )
}
