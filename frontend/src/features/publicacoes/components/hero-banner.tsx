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
    <section className="bg-wine-900 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-3/5 relative group cursor-pointer overflow-hidden rounded-sm shadow-2xl">
            <div className="absolute inset-0 bg-wine-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <Image
              src={imagemUrl}
              alt={titulo}
              width={1200}
              height={400}
              className="w-full h-[350px] lg:h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="w-full lg:w-2/5 flex flex-col justify-center text-center lg:text-left">
            <span className="text-gold-500 font-bold tracking-[0.15em] uppercase text-xs mb-3">
              {categoriaLabel}
            </span>
            <h1 className="font-serif text-3xl md:text-3xl lg:text-[2.5rem] text-white font-bold leading-tight mb-5">
              {titulo}
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed">
              {descricao}
            </p>
            <div>
              <Link
                href="/noticias"
                className="inline-flex items-center bg-gold-500 text-wine-950 px-5 py-2.5 rounded-sm font-bold uppercase tracking-wider text-xs hover:bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
