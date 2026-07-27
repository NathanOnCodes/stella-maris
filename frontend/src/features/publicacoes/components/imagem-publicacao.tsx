import Image from "next/image";

interface Props {
  src: string | null;
  alt: string;
  className?: string;
  categoria?: string | null;
}

export function ImagemPublicacao({ src, alt, className = "", categoria }: Props) {
  if (!src) {
    return (
      <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-wine-950 ${className}`} aria-label={`${alt} — imagem indisponível`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.28),transparent_30%),linear-gradient(135deg,#2a0c10,#5a1f26_55%,#1f0609)]" />
        <div className="relative text-center">
          <span className="block font-serif text-5xl text-gold-500/80">☩</span>
          <span className="mt-3 block text-[9px] font-bold uppercase tracking-[0.25em] text-white/60">{categoria ?? "Vox Regina Caeli"}</span>
        </div>
      </div>
    );
  }

  return <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 600px" className={`object-cover ${className}`} />;
}
