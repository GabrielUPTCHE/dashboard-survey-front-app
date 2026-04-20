import { useState } from 'react';
import { mockUsuarios as initialUsuarios } from '../data/mockUsuarios.js';
import { usersService } from '../services/users.service.js';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import { Table, Thead, Th, Tbody, Td } from '../components/ui/Table.jsx';

// TODO: reemplazar lista mock con: useEffect(() => { apiFetch('/api/users').then(setUsuarios); }, []);

const EMPTY_FORM = {
  numberIdentification: '',
  name: '',
  lastName: '',
  email: '',
  password: '',
  role: 'ADMIN',
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setError('');
  };

  const handleCreate = async () => {
    const requiredFields = ['numberIdentification', 'name', 'lastName', 'email', 'password'];
    const missing = requiredFields.filter((f) => !form[f].trim());
    if (missing.length > 0) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('El correo electrónico no es válido');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // POST /api/users/create — endpoint real del backend Spring Boot
      // Requiere cookie token con ROLE_ADMIN
      const created = await usersService.createUser(form);
      setUsuarios((prev) => [...prev, created]);
      closeModal();
    } catch (err) {
      setError(err.message || 'Error al crear el usuario');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full h-11 px-3 rounded-lg border border-surface-container-highest bg-surface text-on-surface text-sm focus:ring-2 focus:ring-primary outline-none transition';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-on-surface font-headline flex-1">Gestión de Usuarios</h1>
        <Button onClick={() => setShowModal(true)}>
          <span className="material-symbols-outlined text-base">person_add</span>
          Nuevo usuario
        </Button>
      </div>

      <Table>
        <Thead>
          <Th>Nombre</Th>
          <Th>N° Identificación</Th>
          <Th>Email</Th>
          <Th>Rol</Th>
          <Th>Estado</Th>
          <Th>Acciones</Th>
        </Thead>
        <Tbody>
          {usuarios.length === 0 ? (
            <tr>
              <Td className="text-center text-on-surface-variant py-8" colSpan={6}>
                No hay usuarios registrados
              </Td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.numberIdentification} className="hover:bg-slate-50 transition-colors">
                <Td>
                  <p className="font-semibold text-on-surface">{u.name} {u.lastName}</p>
                </Td>
                <Td>{u.numberIdentification}</Td>
                <Td>{u.email}</Td>
                <Td>
                  <Badge variant="primary">{u.role?.name ?? '—'}</Badge>
                </Td>
                <Td>
                  <Badge variant={u.state ? 'success' : 'neutral'}>
                    {u.state ? 'Activo' : 'Inactivo'}
                  </Badge>
                </Td>
                <Td>
                  {/* TODO: implementar edición cuando backend exponga PUT /api/users/:id */}
                  <button
                    disabled
                    title="Próximamente"
                    className="text-xs text-on-surface-variant cursor-not-allowed opacity-50 border border-surface-container-highest rounded-lg px-3 py-1"
                  >
                    Editar
                  </button>
                </Td>
              </tr>
            ))
          )}
        </Tbody>
      </Table>

      {showModal && (
        <Modal
          title="Nuevo usuario"
          onClose={closeModal}
          footer={
            <>
              <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleCreate} loading={saving}>Crear usuario</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-on-surface-variant">Nombre</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Juan" className={inputClass} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-on-surface-variant">Apellido</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="García" className={inputClass} required />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface-variant">N° Identificación</label>
              <input name="numberIdentification" value={form.numberIdentification} onChange={handleChange} placeholder="1234567890" className={inputClass} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface-variant">Correo electrónico</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="usuario@censo.gov.co" className={inputClass} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface-variant">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputClass} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface-variant">Rol</label>
              {/* Solo ADMIN disponible hasta que el backend amplíe ERole */}
              <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="material-symbols-outlined text-rose-500 text-lg shrink-0">error</span>
                <p className="text-sm text-rose-600">{error}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
