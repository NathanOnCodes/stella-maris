import { Cabecalho } from "@/components/cabecalho";
import { Rodape } from "@/components/rodape";

export default function OfflinePage() {
  return (
    <>
      <Cabecalho />
      <main className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-bold">Sem conexão</h1>
        <p className="text-lg text-muted-foreground font-leitura">
          Você está offline. Verifique sua conexão e tente novamente.
        </p>
      </main>
      <Rodape />
    </>
  );
}
