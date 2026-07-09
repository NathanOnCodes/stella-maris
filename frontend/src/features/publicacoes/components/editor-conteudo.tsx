"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Props {
  conteudo: string;
  onChange: (html: string) => void;
}

export function EditorConteudo({ conteudo, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
    ],
    content: conteudo,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border border-input">
      <div className="flex flex-wrap gap-1 border-b border-input bg-muted p-2">
        {[
          { label: "N", action: () => editor.chain().focus().toggleBold().run(), ativo: editor.isActive("bold") },
          { label: "I", action: () => editor.chain().focus().toggleItalic().run(), ativo: editor.isActive("italic") },
          { label: "Título", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), ativo: editor.isActive("heading", { level: 2 }) },
          { label: "Subtítulo", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), ativo: editor.isActive("heading", { level: 3 }) },
          { label: "Lista", action: () => editor.chain().focus().toggleBulletList().run(), ativo: editor.isActive("bulletList") },
          { label: "Citação", action: () => editor.chain().focus().toggleBlockquote().run(), ativo: editor.isActive("blockquote") },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className={`rounded px-2 py-1 text-sm font-ui transition-colors ${
              btn.ativo
                ? "bg-primary text-primary-foreground"
                : "hover:bg-background"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 font-leitura"
      />
    </div>
  );
}
