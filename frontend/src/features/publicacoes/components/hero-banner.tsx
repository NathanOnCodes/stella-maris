import Link from "next/link";

interface Props {
  titulo: string;
  descricao: string;
  categoriaLabel: string;
}

export function HeroBanner({
  titulo,
  descricao,
  categoriaLabel,
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-wine-950/85 text-white backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.12),transparent_38%),linear-gradient(135deg,rgba(42,12,16,0.96),rgba(31,6,9,0.98))]" />
      <div className="container mx-auto px-5 py-12 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="flex w-full flex-col items-center justify-center">
            <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
              {categoriaLabel}
            </span>
            <h1 className="mb-4 max-w-3xl font-serif text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[3.25rem]">
              {titulo}
            </h1>
            <p className="mb-6 max-w-2xl text-sm leading-6 text-white/65 md:text-[15px]">
              {descricao}
            </p>
            <div>
              <Link
                href="/noticias"
                className="inline-flex items-center rounded-full bg-gold-500 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-wine-950 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                Ler Artigo
                <svg className="ml-2 h-4 w-4 font-light transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
