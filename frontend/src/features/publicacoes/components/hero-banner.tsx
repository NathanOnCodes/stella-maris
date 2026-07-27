import Link from "next/link";
import Image from "next/image";

interface Props {
  titulo: string;
  descricao: string;
  categoriaLabel: string;
  imagemUrl?: string;
}

export function HeroBanner({
  titulo,
  descricao,
  categoriaLabel,
  imagemUrl = "https://images.unsplash.com/photo-1548625361-26c6ce7a2015?q=80&w=1200&auto=format&fit=crop",
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-wine-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(212,175,55,0.16),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(114,47,55,0.65),transparent_35%)]" />
      <div className="container mx-auto px-4 py-14 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="group relative order-2 w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl lg:order-1 lg:w-3/5">
            <div className="absolute inset-0 z-10 bg-wine-950/20 transition-colors duration-500 group-hover:bg-transparent" />
            <Image
              src={imagemUrl}
              alt={titulo}
              width={1200}
              height={400}
              className="h-[300px] w-full object-cover transition-transform duration-1000 group-hover:scale-105 sm:h-[400px] lg:h-[500px]"
            />
            <span className="absolute bottom-5 left-5 z-20 rounded-full border border-white/20 bg-wine-950/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400 backdrop-blur-md">Edição especial</span>
          </div>
          <div className="order-1 flex w-full flex-col justify-center text-center lg:order-2 lg:w-2/5 lg:text-left">
            <span className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              {categoriaLabel}
            </span>
            <h1 className="mb-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[4rem]">
              {titulo}
            </h1>
            <p className="mb-9 max-w-xl text-sm leading-7 text-white/65 md:text-base">
              {descricao}
            </p>
            <div>
              <Link
                href="/noticias"
                className="inline-flex items-center rounded-full bg-gold-500 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-wine-950 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                Ler Artigo
                <svg className="w-4 h-4 ml-2 font-light transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
