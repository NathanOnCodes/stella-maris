interface Props {
  citacao: string;
  autor: string;
}

export function QuoteSection({ citacao, autor }: Props) {
  return (
    <section className="relative overflow-hidden border-y border-wine-800 bg-wine-950 py-20">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500 to-transparent" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <span className="mb-5 block text-gold-500/70">
          <svg className="w-10 h-10 mx-auto fill-current" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </span>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400">Frase do Dia</p>
        <blockquote className="mx-auto mb-6 max-w-3xl font-serif text-2xl italic leading-relaxed text-white md:text-3xl">
          &ldquo;{citacao}&rdquo;
        </blockquote>
        <cite className="text-gray-400 text-xs md:text-sm font-semibold uppercase tracking-widest not-italic">
          &mdash; {autor}
        </cite>
      </div>
    </section>
  );
}
