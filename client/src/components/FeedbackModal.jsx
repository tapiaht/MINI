import { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bug, TrendingUp, Sparkles, HelpCircle, ArrowDown, Minus, ArrowUp, AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const tipos = [
  { value: 'bug', label: 'Bug', icon: Bug, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', hover: 'hover:border-red-300' },
  { value: 'mejora', label: 'Mejora', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', hover: 'hover:border-blue-300' },
  { value: 'nuevo', label: 'Nuevo', icon: Sparkles, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', hover: 'hover:border-green-300' },
  { value: 'otro', label: 'Otro', icon: HelpCircle, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', hover: 'hover:border-gray-300' },
];

const prioridades = [
  { value: 'baja', label: 'Baja', icon: ArrowDown, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', hover: 'hover:border-gray-300' },
  { value: 'media', label: 'Media', icon: Minus, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', hover: 'hover:border-yellow-300' },
  { value: 'alta', label: 'Alta', icon: ArrowUp, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', hover: 'hover:border-orange-300' },
  { value: 'critica', label: 'Crítica', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', hover: 'hover:border-red-300' },
];

export default function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [form, setForm] = useState({
    ruta: location.pathname,
    tipo: 'bug',
    descripcion: '',
    prioridad: 'media',
  });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(f => ({ ...f, ruta: location.pathname }));
    }
  }, [open, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.descripcion.trim()) {
      toast.error('Escriba una descripción');
      return;
    }
    setEnviando(true);
    try {
      await api.post('/feedback', form);
      toast.success('Feedback enviado. ¡Gracias!');
      setOpen(false);
      setForm({ ruta: location.pathname, tipo: 'bug', descripcion: '', prioridad: 'media' });
    } catch {
      toast.error('Error al enviar feedback');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center justify-center"
        title="Enviar Feedback"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-md mx-0 sm:mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h2 className="font-semibold text-gray-900">Enviar Feedback</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ruta / Funcionalidad</label>
                <input type="text" value={form.ruta} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <div className="grid grid-cols-4 gap-2">
                  {tipos.map(t => {
                    const selected = form.tipo === t.value;
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setForm({ ...form, tipo: t.value })}
                        className={`flex flex-col items-center gap-1 px-2 py-3 rounded-lg border text-xs font-medium transition ${
                          selected
                            ? `${t.bg} ${t.color} ${t.border} border-2`
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                <div className="grid grid-cols-4 gap-2">
                  {prioridades.map(p => {
                    const selected = form.prioridad === p.value;
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setForm({ ...form, prioridad: p.value })}
                        className={`flex flex-col items-center gap-1 px-2 py-3 rounded-lg border text-xs font-medium transition ${
                          selected
                            ? `${p.bg} ${p.color} ${p.border} border-2`
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  placeholder="Describa el bug, mejora o funcionalidad..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {enviando ? 'Enviando...' : 'Enviar Feedback'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
