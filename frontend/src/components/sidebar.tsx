export function Sidebar() {
  return (
    <aside className="space-y-10 md:sticky md:top-24 h-fit">
      <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 shadow-inner">
        <h3 className="font-serif text-lg font-bold text-wine-900 mb-5 border-b border-gray-200 pb-3">Formação em Destaque</h3>
        <ul className="space-y-3 text-sm">
          <li>
            <a href="#" className="text-wine-700 hover:text-gold-600 transition-colors flex items-center gap-2">
              <span className="text-gold-600 text-xs">☩</span> Introdução à Patrística
            </a>
          </li>
          <li>
            <a href="#" className="text-wine-700 hover:text-gold-600 transition-colors flex items-center gap-2">
              <span className="text-gold-600 text-xs">☩</span> Histórias dos Concílios Teológicos
            </a>
          </li>
          <li>
            <a href="#" className="text-wine-700 hover:text-gold-600 transition-colors flex items-center gap-2">
              <span className="text-gold-600 text-xs">☩</span> Espiritualidade do Deserto
            </a>
          </li>
        </ul>
      </div>
      <div className="bg-wine-900 text-white p-6 rounded-sm border border-gold-500/20 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1572007797825-780996f8c857?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-1000" />
        <div className="relative z-10">
          <p className="text-gold-500 text-xs font-bold uppercase mb-1.5 flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Liturgia Diária
          </p>
          <p className="text-[11px] text-gray-400">17 de Julho, 2026</p>
          <p className="font-serif text-sm mt-3.5 border-t border-wine-800 pt-3.5 italic text-gray-100">Meditação do Evangelho (Atalho p/ Liturgia)</p>
        </div>
      </div>
    </aside>
  );
}
