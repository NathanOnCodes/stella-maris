import type { PublicacaoMaisLida } from "@/features/metricas/types";

interface Props {
  dados: PublicacaoMaisLida[];
}

export function TabelaMaisLidas({ dados }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-ui">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 font-medium">Título</th>
            <th className="pb-2 font-medium">Visualizações</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.publicacao_id} className="border-b border-border">
              <td className="py-2 font-medium">{item.titulo}</td>
              <td className="py-2">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
