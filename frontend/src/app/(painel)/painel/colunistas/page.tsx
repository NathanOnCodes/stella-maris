"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Perfil } from "@/features/autenticacao/types";

const schema = z.object({
  username: z.string().min(3, "Mínimo de 3 caracteres."),
  password: z.string().min(6, "Mínimo de 6 caracteres."),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
});

export default function ColunistasPage() {
  const [colunistas, setColunistas] = useState<Perfil[]>([]);
  const [erro, setErro] = useState("");
  const [aberto, setAberto] = useState(false);

  const form = useForm({ resolver: zodResolver(schema) });
  const { register, handleSubmit, reset, formState: { errors } } = form;

  async function carregar() {
    const res = await fetch("/api/colunistas");
    if (res.ok) setColunistas(await res.json());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
  }, []);

  async function onSubmit(data: z.infer<typeof schema>) {
    setErro("");
    const res = await fetch("/api/colunistas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json();
      setErro(body.detail ?? "Erro ao criar.");
      return;
    }
    reset({ username: "", password: "", email: "" });
    setAberto(false);
    carregar();
  }

  async function excluir(id: number) {
    if (!confirm("Tem certeza?")) return;
    const res = await fetch(`/api/colunistas/${id}`, { method: "DELETE" });
    if (res.ok) carregar();
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">Colunistas</h1>
        <Dialog open={aberto} onOpenChange={setAberto}>
          <DialogTrigger>
            Novo colunista
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Novo colunista</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium font-ui">Usuário *</label>
                <input {...register("username")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui" />
                {errors.username && <p className="text-sm text-destructive font-ui">{errors.username.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium font-ui">Senha *</label>
                <input type="password" {...register("password")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui" />
                {errors.password && <p className="text-sm text-destructive font-ui">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium font-ui">E-mail</label>
                <input {...register("email")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui" />
              </div>
              {erro && <p className="text-sm text-destructive font-ui">{erro}</p>}
              <Button type="submit" className="w-full">Criar colunista</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-ui">Usuário</TableHead>
            <TableHead className="font-ui">E-mail</TableHead>
            <TableHead className="font-ui">Tipo</TableHead>
            <TableHead className="font-ui">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colunistas.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium font-ui">{c.username}</TableCell>
              <TableCell className="font-ui">{c.email}</TableCell>
              <TableCell className="font-ui">{c.tipo}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => excluir(c.id)}>
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
