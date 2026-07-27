import type { PublicacaoResumo } from "@/features/publicacoes/types";
import { CardPublicacao } from "@/features/publicacoes/components/card-publicacao";

interface Props {
  publicacoes: PublicacaoResumo[];
  vazia?: string;
}

export function ListaPublicacoes({
  publicacoes,
  vazia = "Nenhuma publicação encontrada.",
}: Props) {
  if (publicacoes.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground font-leitura">
        {vazia}
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {publicacoes.map((p, i) => (
        <CardPublicacao key={p.id} publicacao={p} index={i} />
      ))}
    </div>
  );
}
