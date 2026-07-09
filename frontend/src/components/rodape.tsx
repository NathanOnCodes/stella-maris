import Link from "next/link";

export function Rodape() {
  return (
    <footer className="mt-auto border-t border-border bg-muted px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row md:text-left">
        <p className="font-ui">
          &copy; {new Date().getFullYear()} Vox Regina Caeli — Revista Católica
          Independente
        </p>
        <div className="flex gap-4 font-ui">
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
          >
            Início
          </Link>
        </div>
      </div>
    </footer>
  );
}
