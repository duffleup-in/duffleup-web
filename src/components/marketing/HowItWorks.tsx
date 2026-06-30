const steps = [
  { n: '01', title: 'Find a place', body: 'Browse verified stays. Filter by mood, not stars.' },
  { n: '02', title: 'Pack & go', body: 'Lock it in. Pay once. No bouncing between 14 tabs.' },
  { n: '03', title: 'Locked in', body: "Pack accordingly. We'll handle the rest." },
]

export function HowItWorks() {
  return (
    <section className="border-b border-white/10 bg-pitch py-16 text-white">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-acid">
          How it works
        </p>
        <h2 className="mb-10 max-w-2xl font-display text-[clamp(40px,6vw,64px)] leading-none">
          Three steps. No 14 tabs.
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-md border border-white/10 bg-white/5 p-8">
              <span className="font-display text-h3 text-acid">{s.n}</span>
              <h3 className="mt-4 font-utility text-h6 uppercase tracking-[0.05em]">
                {s.title}
              </h3>
              <p className="mt-3 text-subh leading-relaxed text-white/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
