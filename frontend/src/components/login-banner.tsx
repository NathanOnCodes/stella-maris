import Image from "next/image";
import Link from "next/link";

export function LoginBanner() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-wine-950 items-center justify-center overflow-hidden shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-10">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548625361-26c6ce7a2015?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 hover:scale-105 transition-transform duration-[10s]" />
      <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-900/80 to-transparent" />
      <div className="relative z-20 p-12 max-w-lg text-center reveal-up">
        <Link href="/" className="inline-flex flex-col items-center mb-10 group">
          <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6 group-hover:scale-105 transition-transform duration-500 rounded-full p-1 bg-gradient-to-br from-gold-400 via-gold-600 to-yellow-900 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Image
              src="/logo_monograma_maria_santissima.jpeg"
              alt="Logo Monograma MR Vox Regina Caeli"
              width={192}
              height={192}
              className="w-full h-full object-cover rounded-full border-4 border-wine-950"
            />
          </div>
          <span className="font-serif text-3xl font-bold text-white tracking-wide">Vox Regina Caeli</span>
        </Link>
        <blockquote className="font-serif text-2xl text-gray-200 italic leading-relaxed mb-6">
          &ldquo;A fé e a razão são como duas asas pelas quais o espírito humano se eleva para a contemplação da verdade.&rdquo;
        </blockquote>
        <cite className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em] not-italic">
          &mdash; Papa João Paulo II, Fides et Ratio
        </cite>
      </div>
    </div>
  );
}
