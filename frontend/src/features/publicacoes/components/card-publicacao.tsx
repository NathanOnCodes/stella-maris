import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PublicacaoResumo } from "@/features/publicacoes/types";

interface Props {
  publicacao: PublicacaoResumo;
}

export function CardPublicacao({ publicacao }: Props) {
  return (
    <Link href={`/artigo/${publicacao.slug}`}>
      <Card className="group transition-colors hover:bg-muted/50">
        <CardContent className="flex flex-col gap-2 p-5">
          {publicacao.categoria_nome && (
            <Badge variant="secondary" className="w-fit text-xs uppercase tracking-wider">
              {publicacao.categoria_nome}
            </Badge>
          )}
          <h2 className="text-xl font-display font-semibold leading-tight group-hover:text-primary">
            {publicacao.titulo}
          </h2>
          {publicacao.subtitulo && (
            <p className="text-sm text-muted-foreground font-leitura">
              {publicacao.subtitulo}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-ui">
            <span>{publicacao.autor_nome}</span>
            {publicacao.data_publicacao && (
              <>
                <span>·</span>
                <time>
                  {new Date(publicacao.data_publicacao).toLocaleDateString("pt-BR")}
                </time>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
