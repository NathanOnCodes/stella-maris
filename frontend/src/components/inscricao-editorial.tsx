import Link from "next/link";

export function InscricaoEditorial() {
  return (
    <section className="relative isolate overflow-hidden bg-canvas py-16 text-wine-950 lg:py-20">
      <div className="absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="absolute -bottom-40 -left-24 -z-10 h-80 w-80 rounded-full bg-wine-700/10 blur-3xl" />
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:flex-row sm:items-center lg:px-8">
        <div className="max-w-xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-wine-700">Uma pausa para o essencial</p>
          <h2 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">Receba o melhor da nossa mesa editorial.</h2>
          <p className="mt-4 text-sm leading-relaxed text-wine-950/60">Ensaios, formação e cultura católica para acompanhar sua semana com profundidade.</p>
        </div>
        <Link href="/entrar" className="inline-flex shrink-0 items-center rounded-full bg-gold-500 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-wine-950 transition hover:-translate-y-1 hover:bg-white">Fazer parte <span className="ml-3 text-lg leading-none">→</span></Link>
      </div>
    </section>
  );
}
