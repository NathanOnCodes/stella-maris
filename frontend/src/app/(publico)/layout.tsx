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
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {children}
      </main>
      <Rodape />
    </>
  );
}
