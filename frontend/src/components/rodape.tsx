import Link from "next/link";
import { AtSign, Globe, Share2, Send } from "lucide-react";
import { obterConfiguracao } from "@/features/configuracoes/api/buscar-configuracao";

const CATEGORIAS = [
  { nome: "Notícias", slug: "noticias" },
  { nome: "Espiritualidade", slug: "espiritualidade" },
  { nome: "Apologética", slug: "apologetica" },
  { nome: "Entrevistas", slug: "entrevistas" },
  { nome: "Colunas", slug: "colunas" },
];

export async function Rodape() {
  const config = await obterConfiguracao();

  const redes = [
    { url: config?.instagram, Icone: AtSign, nome: "Instagram" },
    { url: config?.youtube, Icone: Globe, nome: "YouTube" },
    { url: config?.facebook, Icone: Share2, nome: "Facebook" },
    { url: config?.twitter_x, Icone: Send, nome: "Twitter / X" },
  ].filter((r) => r.url);

  return (
    <footer className="borda-neon-inferior mt-auto bg-foreground text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div className="space-y-3">
          <h3 className="texto-neon font-display text-xl font-bold">
            {config?.nome_site ?? "Vox Regina Caeli"}
          </h3>
          <p className="max-w-xs text-sm text-white/70 font-leitura leading-relaxed">
            {config?.descricao ??
              "Revista digital católica independente."}
          </p>
        </div>

        <nav className="space-y-3">
          <h4 className="font-ui text-sm font-semibold uppercase tracking-wider text-white/90">
            Seções
          </h4>
          <ul className="space-y-2">
            {CATEGORIAS.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/${cat.slug}`}
                  className="link-neon text-sm text-white/70 hover:text-white"
                >
                  {cat.nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <h4 className="font-ui text-sm font-semibold uppercase tracking-wider text-white/90">
            Redes sociais
          </h4>
          {redes.length > 0 ? (
            <div className="flex gap-4">
              {redes.map(({ url, Icone, nome }) => (
                <a
                  key={nome}
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nome}
                  className="link-neon text-white/70 transition-colors hover:text-white"
                >
                  <Icone className="size-5" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/50 font-leitura">
              Em breve.
            </p>
          )}
          {config?.email_contato && (
            <a
              href={`mailto:${config.email_contato}`}
              className="block text-sm text-white/70 hover:text-white font-ui"
            >
              {config.email_contato}
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5">
        <p className="mx-auto max-w-6xl text-center text-xs text-white/50 font-ui md:text-left">
          &copy; {new Date().getFullYear()}{" "}
          {config?.nome_site ?? "Vox Regina Caeli"} — Revista Católica
          Independente
        </p>
      </div>
    </footer>
  );
}
