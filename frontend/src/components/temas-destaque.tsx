import Link from "next/link";

const TEMAS = [
  { nome: "Magistério", descricao: "A voz viva da Igreja", slug: "noticias" },
  { nome: "Espiritualidade", descricao: "Vida interior e oração", slug: "espiritualidade" },
  { nome: "Liturgia", descricao: "O mistério celebrado", slug: "liturgia" },
  { nome: "Cultura", descricao: "Fé, razão e beleza", slug: "colunas" },
];

export function TemasDestaque() {
  return (
    <section className="border-y border-wine-900/10 bg-[#f5f1eb] py-5" aria-label="Explorar temas">
      <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TEMAS.map((tema) => (
          <Link key={tema.nome} href={`/${tema.slug}`} className="group min-w-[190px] flex-1 rounded-2xl border border-wine-900/10 bg-white/70 px-5 py-4 transition hover:-translate-y-0.5 hover:border-gold-500 hover:bg-white">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-wine-700">{tema.nome}</span>
            <span className="text-sm text-gray-600 group-hover:text-wine-950">{tema.descricao}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
