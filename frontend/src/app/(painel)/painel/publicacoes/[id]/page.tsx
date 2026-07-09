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
  status: z.string().default("rascunho"),
  categoria_id: z.string().optional(),
});

export default function EditarPublicacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [conteudo, setConteudo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [carregou, setCarregou] = useState(false);
  const [publicacaoId, setPublicacaoId] = useState<number>(0);

  const form = useForm({
    resolver: zodResolver(schema),
  });
  const { register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setPublicacaoId(Number(id));
      const res = await fetch(`/api/publicacoes/admin/obter/${id}`);
      if (!res.ok) return;
      const pub = await res.json();
      reset({
        titulo: pub.titulo,
        subtitulo: pub.subtitulo,
        status: pub.status,
        categoria_id: pub.categoria_id?.toString() ?? "",
      });
      setConteudo(pub.conteudo);
      setCarregou(true);
    })();
  }, [params, reset]);

  async function onSubmit(data: z.infer<typeof schema>) {
    setEnviando(true);
    setErro("");

    const htmlSanitizado = sanitizeHtml(conteudo, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h2", "h3", "h4"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "class"],
      },
    });

    const payload = {
      titulo: data.titulo,
      subtitulo: data.subtitulo,
      status: data.status,
      conteudo: htmlSanitizado,
      categoria_id: data.categoria_id ? Number(data.categoria_id) : null,
    };

    const res = await fetch(`/api/publicacoes/admin/atualizar/${publicacaoId}`, {
      method: "PUT",
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

  if (!carregou) {
    return <p className="py-8 text-center text-muted-foreground font-leitura">Carregando…</p>;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Editar publicação</h1>

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
