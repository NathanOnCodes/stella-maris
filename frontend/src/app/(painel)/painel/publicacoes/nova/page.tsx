"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { EditorConteudo } from "@/features/publicacoes/components/editor-conteudo";

const schema = z.object({
  titulo: z.string().min(3, "Título deve ter ao menos 3 caracteres."),
  subtitulo: z.string().optional(),
  slug: z.string().optional(),
  status: z.string().default("rascunho"),
  tipo_editorial: z.enum(["artigo", "entrevista", "coluna"]).default("artigo"),
  categoria_id: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NovaPublicacaoPage() {
  const router = useRouter();
  const [conteudo, setConteudo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tags, setTags] = useState<{ id: number; nome: string }[]>([]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: "rascunho", tipo_editorial: "artigo" },
  });
  const { register, handleSubmit, formState: { errors } } = form;

  useEffect(() => {
    fetch("/api/publicacoes/metadata")
      .then((r) => r.json())
      .then((d) => {
        setCategorias(d.categorias ?? []);
        setTags(d.tags ?? []);
      })
      .catch(() => {});
  }, []);

  async function onSubmit(data: FormData) {
    setEnviando(true);
    setErro("");

    const htmlSanitizado = sanitizeHtml(conteudo, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "h2", "h3", "h4",
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "class"],
      },
    });

    const payload = {
      titulo: data.titulo,
      subtitulo: data.subtitulo,
      status: data.status,
      tipo_editorial: data.tipo_editorial,
      conteudo: htmlSanitizado,
      categoria_id: data.categoria_id ? Number(data.categoria_id) : null,
      data_publicacao: data.status === "publicado"
        ? new Date().toISOString()
        : null,
    };

    const res = await fetch("/api/publicacoes/admin/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json();
      setErro(body.detail ?? "Erro ao salvar.");
      setEnviando(false);
      return;
    }

    router.push("/painel/publicacoes");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Nova publicação</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="space-y-2">
          <label className="text-sm font-medium font-ui">Título *</label>
          <input
            {...register("titulo")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui"
          />
          {errors.titulo && (
            <p className="text-sm text-destructive font-ui">{errors.titulo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium font-ui">Subtítulo</label>
          <input
            {...register("subtitulo")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium font-ui">Conteúdo</label>
          <EditorConteudo conteudo={conteudo} onChange={setConteudo} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium font-ui">Tipo editorial</label>
            <select {...register("tipo_editorial")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui">
              <option value="artigo">Artigo</option>
              <option value="entrevista">Entrevista</option>
              <option value="coluna">Coluna</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium font-ui">Categoria</label>
            <select
              {...register("categoria_id")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui"
            >
              <option value="">Sem categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-ui">Status</label>
            <select
              {...register("status")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui"
            >
              <option value="rascunho">Rascunho</option>
              <option value="publicado">Publicado</option>
              <option value="arquivado">Arquivado</option>
            </select>
          </div>
        </div>

        {erro && <p className="text-sm text-destructive font-ui">{erro}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={enviando}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground font-ui transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {enviando ? "Salvando…" : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 py-2 text-sm font-medium font-ui transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
