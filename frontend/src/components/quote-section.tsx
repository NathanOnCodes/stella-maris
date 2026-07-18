interface Props {
  citacao: string;
  autor: string;
}

export function QuoteSection({ citacao, autor }: Props) {
  return (
    <section className="bg-wine-950 py-16 relative overflow-hidden border-y border-wine-800">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500 to-transparent" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <span className="text-wine-700 block mb-5">
          <svg className="w-10 h-10 mx-auto fill-current" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </span>
        <p className="text-gold-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-3">Frase do Dia</p>
        <blockquote className="font-serif text-xl md:text-2xl text-white italic max-w-3xl mx-auto leading-relaxed mb-5">
          &ldquo;{citacao}&rdquo;
        </blockquote>
        <cite className="text-gray-400 text-xs md:text-sm font-semibold uppercase tracking-widest not-italic">
          &mdash; {autor}
        </cite>
      </div>
    </section>
  );
}
