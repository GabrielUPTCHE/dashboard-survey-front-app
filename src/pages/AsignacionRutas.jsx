import { useState } from 'react';
import { mockRutas as initialRutas, mockEncuestadores } from '../data/mockRutas.js';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import { Table, Thead, Th, Tbody, Td } from '../components/ui/Table.jsx';

// TODO: reemplazar estado local con llamada a la API:
// useEffect(() => { apiFetch(`/api/turnos?fecha=${fecha}`).then(setRutas); }, [fecha]);
// Guardar: POST /api/turnos o PUT /api/turnos/:id

const estadoVariant = (estado) => {
  if (estado === 'Completada') return 'success';
  if (estado === 'En Progreso') return 'primary';
  if (estado === 'Pendiente') return 'warning';
  if (estado === 'Sin asignar') return 'danger';
  return 'neutral';
};

const EMPTY_FORM = { encuestadorId: '', fecha: '', horaInicio: '', horaFin: '' };

export default function AsignacionRutas() {
  const [rutas, setRutas] = useState(initialRutas);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [encuestadorFiltro, setEncuestadorFiltro] = useState('');
  const [modal, setModal] = useState(null); // null | { ruta } | 'nueva'
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const rutasFiltradas = rutas.filter((r) => {
    if (fechaFiltro && r.fecha !== fechaFiltro) return false;
    if (encuestadorFiltro && r.encuestadorId !== encuestadorFiltro) return false;
    return true;
  });

  const openAssign = (ruta) => {
    setForm({
      encuestadorId: ruta.encuestadorId ?? '',
      fecha: ruta.fecha ?? '',
      horaInicio: ruta.horaInicio ?? '',
      horaFin: ruta.horaFin ?? '',
    });
    setModal({ ruta });
  };

  const openNueva = () => {
    setForm(EMPTY_FORM);
    setModal('nueva');
  };

  const closeModal = () => {
    setModal(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === 'nueva') {
        // TODO: POST /api/turnos con { sujetoId, encuestadorId, fecha, horaInicio, horaFin }
        const nueva = {
          id: Date.now(),
          sujeto: { nombre: 'Nueva ruta', direccion: '—', barrio: '—', zona: '—' },
          encuestadorId: form.encuestadorId || null,
          encuestadorNombre: mockEncuestadores.find((e) => e.id === form.encuestadorId)?.nombre ?? null,
          fecha: form.fecha,
          horaInicio: form.horaInicio,
          horaFin: form.horaFin,
          estado: form.encuestadorId ? 'Pendiente' : 'Sin asignar',
        };
        setRutas((prev) => [...prev, nueva]);
      } else {
        // TODO: PUT /api/turnos/:id con { encuestadorId, fecha, horaInicio, horaFin }
        const encuestador = mockEncuestadores.find((e) => e.id === form.encuestadorId);
        setRutas((prev) =>
          prev.map((r) =>
            r.id === modal.ruta.id
              ? {
                  ...r,
                  encuestadorId: form.encuestadorId || null,
                  encuestadorNombre: encuestador?.nombre ?? null,
                  fecha: form.fecha,
                  horaInicio: form.horaInicio,
                  horaFin: form.horaFin,
                  estado: form.encuestadorId
                    ? (modal.ruta.estado === 'Sin asignar' ? 'Pendiente' : modal.ruta.estado)
                    : 'Sin asignar',
                }
              : r
          )
        );
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full h-11 px-3 rounded-lg border border-surface-container-highest bg-surface text-on-surface text-sm focus:ring-2 focus:ring-primary outline-none transition';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-on-surface font-headline flex-1">Asignación de Rutas</h1>
        <Button disabled title="Disponible cuando el backend exponga POST /api/turnos con búsqueda de sujeto">
          <span className="material-symbols-outlined text-base">add</span>
          Nueva ruta
        </Button>
      </div>

      {/* Filtros */}
      {/* TODO: el selector de encuestadores cargará desde GET /api/usuarios?rol=encuestador */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-surface-container border border-surface-container-highest rounded-xl px-4 py-2">
          <span className="material-symbols-outlined text-on-surface-variant text-base">calendar_today</span>
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="text-sm text-on-surface bg-transparent outline-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-surface-container border border-surface-container-highest rounded-xl px-4 py-2">
          <span className="material-symbols-outlined text-on-surface-variant text-base">person</span>
          <select
            value={encuestadorFiltro}
            onChange={(e) => setEncuestadorFiltro(e.target.value)}
            className="text-sm text-on-surface bg-transparent outline-none"
          >
            <option value="">Todos los encuestadores</option>
            {mockEncuestadores.map((enc) => (
              <option key={enc.id} value={enc.id}>{enc.nombre}</option>
            ))}
          </select>
        </div>
        {(fechaFiltro || encuestadorFiltro) && (
          <button
            onClick={() => { setFechaFiltro(''); setEncuestadorFiltro(''); }}
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <Table>
        <Thead>
          <Th>Sujeto / Dirección</Th>
          <Th>Encuestador</Th>
          <Th>Fecha</Th>
          <Th>Horario</Th>
          <Th>Estado</Th>
          <Th>Acción</Th>
        </Thead>
        <Tbody>
          {rutasFiltradas.length === 0 ? (
            <tr>
              <Td className="text-center text-on-surface-variant py-8" colSpan={6}>
                Sin rutas para los filtros seleccionados
              </Td>
            </tr>
          ) : (
            rutasFiltradas.map((ruta) => (
              <tr key={ruta.id} className="hover:bg-slate-50 transition-colors">
                <Td>
                  <p className="font-semibold text-on-surface">{ruta.sujeto.nombre}</p>
                  <p className="text-xs text-on-surface-variant">{ruta.sujeto.direccion} · {ruta.sujeto.barrio}</p>
                </Td>
                <Td>
                  {ruta.encuestadorNombre ?? (
                    <span className="text-on-surface-variant italic">Sin asignar</span>
                  )}
                </Td>
                <Td>{ruta.fecha ?? '—'}</Td>
                <Td>
                  {ruta.horaInicio ? `${ruta.horaInicio} – ${ruta.horaFin}` : '—'}
                </Td>
                <Td>
                  <Badge variant={estadoVariant(ruta.estado)}>{ruta.estado}</Badge>
                </Td>
                <Td>
                  {ruta.estado !== 'Completada' && (
                    <Button variant="ghost" className="!py-1 !px-3 !text-xs" onClick={() => openAssign(ruta)}>
                      {ruta.encuestadorId ? 'Editar' : 'Asignar'}
                    </Button>
                  )}
                </Td>
              </tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Modal asignación / nueva ruta */}
      {modal !== null && (
        <Modal
          title={modal === 'nueva' ? 'Nueva ruta' : `Asignar — ${modal.ruta.sujeto.nombre}`}
          onClose={closeModal}
          footer={
            <>
              <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleSave} loading={saving}>Guardar</Button>
            </>
          }
        >
          <div className="space-y-4">
            {modal !== 'nueva' && (
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Sujeto</p>
                <p className="text-on-surface font-semibold">{modal.ruta.sujeto.nombre}</p>
                <p className="text-xs text-on-surface-variant">{modal.ruta.sujeto.direccion}</p>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface-variant">Encuestador</label>
              {/* TODO: cargar encuestadores desde GET /api/usuarios?rol=encuestador */}
              <select
                value={form.encuestadorId}
                onChange={(e) => setForm((p) => ({ ...p, encuestadorId: e.target.value }))}
                className={inputClass}
              >
                <option value="">Sin asignar</option>
                {mockEncuestadores.map((enc) => (
                  <option key={enc.id} value={enc.id}>{enc.nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface-variant">Fecha</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-on-surface-variant">Hora inicio</label>
                <input
                  type="time"
                  value={form.horaInicio}
                  onChange={(e) => setForm((p) => ({ ...p, horaInicio: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-on-surface-variant">Hora fin</label>
                <input
                  type="time"
                  value={form.horaFin}
                  onChange={(e) => setForm((p) => ({ ...p, horaFin: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
