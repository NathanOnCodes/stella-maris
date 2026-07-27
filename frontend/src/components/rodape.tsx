import Link from "next/link";
import { obterConfiguracao } from "@/features/configuracoes/api/buscar-configuracao";

const CATEGORIAS = [
  { nome: "Notícias", slug: "noticias" },
  { nome: "Espiritualidade", slug: "espiritualidade" },
  { nome: "Apologética", slug: "apologetica" },
  { nome: "Entrevistas", slug: "entrevistas" },
  { nome: "Colunas", slug: "colunas" },
  { nome: "Nossa Missão", slug: "nossa-missao" },
];

export async function Rodape() {
  const config = await obterConfiguracao();

  return (
    <footer className="border-t border-gold-500/20 bg-wine-950 pb-8 pt-20 text-gray-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <h2 className="mb-4 font-serif text-2xl font-bold text-white">
              <span className="text-gold-500">☩</span> {config?.nome_site ?? "Vox Regina Caeli"}
            </h2>
            <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
              {config?.descricao ?? "Revista digital católica independente. Fiel ao Magistério, em defesa da verdade e promoção da espiritualidade cristã baseada nos ensinamentos dos Santos Padres."}
            </p>
            <div className="flex space-x-4">
              <a
                href={config?.instagram ?? "#"}
                className="w-10 h-10 rounded-full bg-wine-900 flex items-center justify-center hover:bg-gold-500 hover:text-wine-950 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z" />
                </svg>
              </a>
              <a
                href={config?.youtube ?? "#"}
                className="w-10 h-10 rounded-full bg-wine-900 flex items-center justify-center hover:bg-gold-500 hover:text-wine-950 transition-all"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Seções</h3>
            <ul className="space-y-3 text-sm">
              {CATEGORIAS.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="hover:text-gold-500 transition-colors">
                    {cat.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-wine-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {config?.nome_site ?? "Vox Regina Caeli"}. Todos os direitos reservados.</p>
          <p className="font-serif italic mt-2 md:mt-0">&ldquo;Omnia ad gloriam Dei&rdquo;</p>
        </div>
      </div>
    </footer>
  );
}
