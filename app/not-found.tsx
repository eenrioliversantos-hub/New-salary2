import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl font-black">
          404
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900">
            Page non trouvée · Página não encontrada
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            La page demandée n’existe pas ou a été déplacée. Vous pouvez retourner au calculateur de salaire du Québec.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Retour à l’accueil · Voltar ao Início</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
