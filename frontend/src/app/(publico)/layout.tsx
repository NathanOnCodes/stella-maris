import { Topbar } from "@/components/topbar";
import { Cabecalho } from "@/components/cabecalho";
import { Rodape } from "@/components/rodape";

export default function PublicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Topbar />
      <Cabecalho />
      <main className="flex-1">{children}</main>
      <Rodape />
    </>
  );
}
