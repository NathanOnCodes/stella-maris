import { Cabecalho } from "@/components/cabecalho";
import { Rodape } from "@/components/rodape";

export default function PublicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Cabecalho />
      <main className="fundo-degrade-pagina flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 py-8">{children}</div>
      </main>
      <Rodape />
    </>
  );
}
