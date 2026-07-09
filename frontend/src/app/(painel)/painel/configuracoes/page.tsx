"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const schema = z.object({
  nome_site: z.string().min(1, "Obrigatório."),
  descricao: z.string().optional(),
  email_contato: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  facebook: z.string().optional(),
  twitter_x: z.string().optional(),
});

export default function ConfiguracoesPage() {
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState("");

  const form = useForm({ resolver: zodResolver(schema) });
  const { register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    fetch("/api/configuracoes")
      .then((r) => r.json())
      .then((data) => {
        reset({
          nome_site: data.nome_site ?? "",
          descricao: data.descricao ?? "",
          email_contato: data.email_contato ?? "",
          instagram: data.instagram ?? "",
          youtube: data.youtube ?? "",
          facebook: data.facebook ?? "",
          twitter_x: data.twitter_x ?? "",
        });
      })
      .catch(() => setErro("Erro ao carregar configurações."));
  }, [reset]);

  async function onSubmit(data: z.infer<typeof schema>) {
    setErro("");
    setSalvo(false);
    const res = await fetch("/api/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSalvo(true);
    } else {
      const body = await res.json();
      setErro(body.detail ?? "Erro ao salvar.");
    }
  }

  return (
    <section className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold">Configurações do site</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium font-ui">Nome do site *</label>
          <input {...register("nome_site")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui" />
          {errors.nome_site && <p className="text-sm text-destructive font-ui">{errors.nome_site.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium font-ui">Descrição</label>
          <textarea {...register("descricao")} className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium font-ui">E-mail de contato</label>
          <input {...register("email_contato")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium font-ui">Instagram</label>
            <input {...register("instagram")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium font-ui">YouTube</label>
            <input {...register("youtube")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium font-ui">Facebook</label>
            <input {...register("facebook")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium font-ui">Twitter / X</label>
            <input {...register("twitter_x")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui" />
          </div>
        </div>

        {erro && <p className="text-sm text-destructive font-ui">{erro}</p>}
        {salvo && <p className="text-sm text-green-600 dark:text-green-400 font-ui">Configurações salvas.</p>}

        <Button type="submit">Salvar configurações</Button>
      </form>
    </section>
  );
}
