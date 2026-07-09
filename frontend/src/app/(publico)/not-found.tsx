import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-4xl font-display font-bold">404</h1>
      <p className="text-lg text-muted-foreground font-leitura">
        Página não encontrada.
      </p>
      <Link
        href="/"
        className="text-sm font-ui font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
      >
        Voltar ao início
      </Link>
    </section>
  );
}
