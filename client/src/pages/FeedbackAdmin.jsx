import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { MessageSquare, CheckCircle } from 'lucide-react';

const tipoLabels = { bug: 'Bug', mejora: 'Mejora', nuevo: 'Nueva Func.', otro: 'Otro' };
const tipoColors = { bug: 'text-red-600 bg-red-50', mejora: 'text-blue-600 bg-blue-50', nuevo: 'text-green-600 bg-green-50', otro: 'text-gray-600 bg-gray-50' };
const prioridadLabels = { baja: 'Baja', media: 'Media', alta: 'Alta', critica: 'Crítica' };
const prioridadColors = { baja: 'text-gray-600 bg-gray-100', media: 'text-yellow-600 bg-yellow-50', alta: 'text-orange-600 bg-orange-50', critica: 'text-red-600 bg-red-50' };
const estadoLabels = { nuevo: 'Nuevo', en_progreso: 'En Progreso', resuelto: 'Resuelto', cerrado: 'Cerrado' };
const estadoColors = { nuevo: 'text-blue-600 bg-blue-50', en_progreso: 'text-yellow-600 bg-yellow-50', resuelto: 'text-green-600 bg-green-50', cerrado: 'text-gray-500 bg-gray-100' };
const estadosSiguientes = { nuevo: 'en_progreso', en_progreso: 'resuelto', resuelto: 'cerrado', cerrado: null };

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [total, setTotal] = useState(0);
  const [filtros, setFiltros] = useState({ estado: '', tipo: '', prioridad: '' });

  const cargar = async () => {
    try {
      const params = {};
      Object.entries(filtros).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await api.get('/feedback', { params });
      setFeedbacks(data.feedbacks);
      setTotal(data.total);
    } catch { toast.error('Error al cargar feedbacks'); }
  };

  useEffect(() => { cargar(); }, [filtros]);

  const avanzarEstado = async (fb) => {
    const sig = estadosSiguientes[fb.estado];
    if (!sig) return;
    try {
      await api.put(`/feedback/${fb.id}/estado`, { estado: sig });
      toast.success(`Estado cambiado a "${estadoLabels[sig]}"`);
      cargar();
    } catch { toast.error('Error al actualizar estado'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Feedback</h1>
        <span className="text-sm text-gray-500">{total} reportes</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <select value={filtros.estado} onChange={e => setFiltros({ ...filtros, estado: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Todos los estados</option>
          {Object.entries(estadoLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filtros.tipo} onChange={e => setFiltros({ ...filtros, tipo: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Todos los tipos</option>
          {Object.entries(tipoLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filtros.prioridad} onChange={e => setFiltros({ ...filtros, prioridad: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Todas las prioridades</option>
          {Object.entries(prioridadLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {feedbacks.map(fb => (
          <div key={fb.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${tipoColors[fb.tipo]}`}>{tipoLabels[fb.tipo]}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${prioridadColors[fb.prioridad]}`}>{prioridadLabels[fb.prioridad]}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${estadoColors[fb.estado]}`}>{estadoLabels[fb.estado]}</span>
                  <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString('es-BO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-gray-400 mb-1 font-mono">{fb.ruta}</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{fb.descripcion}</p>
                <p className="text-xs text-gray-400 mt-2">Enviado por: {fb.Usuario?.nombreCompleto || fb.Usuario?.username || '—'}</p>
              </div>
              <div className="flex-shrink-0">
                {estadosSiguientes[fb.estado] && (
                  <button
                    onClick={() => avanzarEstado(fb)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {estadoLabels[estadosSiguientes[fb.estado]]}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {feedbacks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay feedbacks</p>
          </div>
        )}
      </div>
    </div>
  );
}
