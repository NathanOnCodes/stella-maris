import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listarPublicacoesAdmin } from "@/features/publicacoes/api/admin-publicacoes";

export const dynamic = "force-dynamic";

const COR_STATUS: Record<string, string> = {
  rascunho: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  publicado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  arquivado: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
} as const;

export default async function AdminPublicacoesPage() {
  const publicacoes = await listarPublicacoesAdmin().catch(() => []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">Publicações</h1>
        <Link
          href="/painel/publicacoes/nova"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-ui font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Nova publicação
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-ui">Título</TableHead>
            <TableHead className="font-ui">Autor</TableHead>
            <TableHead className="font-ui">Categoria</TableHead>
            <TableHead className="font-ui">Status</TableHead>
            <TableHead className="font-ui">Tipo</TableHead>
            <TableHead className="font-ui">Leituras</TableHead>
            <TableHead className="font-ui">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publicacoes.map((pub) => (
            <TableRow key={pub.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/painel/publicacoes/${pub.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {pub.titulo}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground font-ui">
                {pub.autor_nome}
              </TableCell>
              <TableCell className="font-ui">
                {pub.categoria_nome ?? "—"}
              </TableCell>
              <TableCell>
                <Badge className={COR_STATUS[pub.status] ?? ""}>
                  {pub.status}
                </Badge>
              </TableCell>
              <TableCell className="font-ui text-xs uppercase tracking-wide">
                {pub.tipo_editorial ?? "artigo"}
              </TableCell>
              <TableCell className="font-ui text-sm text-muted-foreground">
                {pub.visualizacoes_total ?? 0}
              </TableCell>
              <TableCell className="text-muted-foreground font-ui text-sm">
                {pub.data_publicacao
                  ? new Date(pub.data_publicacao).toLocaleDateString("pt-BR")
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {publicacoes.length === 0 && (
        <p className="py-8 text-center text-muted-foreground font-leitura">
          Nenhuma publicação encontrada.
        </p>
      )}
    </section>
  );
}
