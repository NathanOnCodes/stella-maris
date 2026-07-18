"use client";

export function Topbar() {
  return (
    <div className="hidden md:block bg-wine-950 text-gray-300 text-xs py-2 border-b border-wine-800">
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        <div className="font-serif italic text-gold-500">
          &ldquo;Todas as gerações me proclamarão bem-aventurada&rdquo; - São Lucas 1, 48.
        </div>
        <div className="flex space-x-6 uppercase tracking-widest font-semibold">
          <a href="#" className="hover:text-gold-500 transition-colors">Loja</a>
          <a href="#" className="hover:text-gold-500 transition-colors">Inscreva-se</a>
          <a href="#" className="hover:text-gold-500 transition-colors">Entrar</a>
        </div>
      </div>
    </div>
  );
}
