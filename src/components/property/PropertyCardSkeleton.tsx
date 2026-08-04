// Loading placeholder that matches PropertyCard's footprint (decision 6). Pulse
// via Tailwind animate-pulse; gray blocks for photo / name / location / chips.
export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <div className="aspect-[16/10] animate-pulse bg-sterling" />
      <div className="px-5 pb-5 pt-4">
        <div className="mb-2 h-6 w-3/5 animate-pulse rounded-xsm bg-sterling" />
        <div className="mb-4 h-3 w-2/5 animate-pulse rounded-xsm bg-sterling" />
        <div className="mb-4 flex gap-1.5">
          <div className="h-5 w-16 animate-pulse rounded-xsm bg-sterling" />
          <div className="h-5 w-16 animate-pulse rounded-xsm bg-sterling" />
        </div>
        <div className="border-t border-line pt-3">
          <div className="h-6 w-1/3 animate-pulse rounded-xsm bg-sterling" />
        </div>
      </div>
    </div>
  )
}
