// Mock data para la pantalla de Asignación de Rutas.
// Reemplazar con llamadas a la API cuando el backend las exponga.

// TODO: GET /api/turnos?fecha=YYYY-MM-DD → Ruta[]
// TODO: POST /api/turnos → crear nueva ruta/turno
// TODO: PUT /api/turnos/:id → actualizar ruta (asignar/reasignar encuestador)

// Lista de encuestadores disponibles
// TODO: GET /api/usuarios?rol=encuestador → Encuestador[]
export const mockEncuestadores = [
  { id: '1001', nombre: 'Juan García' },
  { id: '1002', nombre: 'María López' },
  { id: '1003', nombre: 'Carlos Ruiz' },
  { id: '1004', nombre: 'Ana Martínez' },
  { id: '1005', nombre: 'Pedro Gómez' },
];

// Rutas del día
export const mockRutas = [
  {
    id: 1,
    sujeto: { nombre: 'Panadería El Trigo', direccion: 'Calle 45 # 12-34', barrio: 'Centro', zona: 'Urbana' },
    encuestadorId: '1001',
    encuestadorNombre: 'Juan García',
    fecha: '2026-04-19',
    horaInicio: '09:00',
    horaFin: '10:00',
    estado: 'Pendiente',
  },
  {
    id: 2,
    sujeto: { nombre: 'Tienda La Esquina', direccion: 'Av. Principal # 3-10', barrio: 'Sur', zona: 'Urbana' },
    encuestadorId: '1002',
    encuestadorNombre: 'María López',
    fecha: '2026-04-19',
    horaInicio: '10:00',
    horaFin: '11:00',
    estado: 'Completada',
  },
  {
    id: 3,
    sujeto: { nombre: 'Ferretería Centro', direccion: 'Carrera 8 # 5-20', barrio: 'Centro', zona: 'Urbana' },
    encuestadorId: null,
    encuestadorNombre: null,
    fecha: '2026-04-19',
    horaInicio: null,
    horaFin: null,
    estado: 'Sin asignar',
  },
  {
    id: 4,
    sujeto: { nombre: 'Supermercado Norte', direccion: 'Calle 12 # 8-45', barrio: 'Norte', zona: 'Urbana' },
    encuestadorId: '1003',
    encuestadorNombre: 'Carlos Ruiz',
    fecha: '2026-04-19',
    horaInicio: '08:00',
    horaFin: '09:30',
    estado: 'En Progreso',
  },
  {
    id: 5,
    sujeto: { nombre: 'Droguería Salud', direccion: 'Cra 15 # 20-10', barrio: 'Oriental', zona: 'Urbana' },
    encuestadorId: null,
    encuestadorNombre: null,
    fecha: '2026-04-19',
    horaInicio: null,
    horaFin: null,
    estado: 'Sin asignar',
  },
  {
    id: 6,
    sujeto: { nombre: 'Restaurante El Buen Sabor', direccion: 'Calle 30 # 6-18', barrio: 'Centro', zona: 'Urbana' },
    encuestadorId: '1004',
    encuestadorNombre: 'Ana Martínez',
    fecha: '2026-04-20',
    horaInicio: '14:00',
    horaFin: '15:00',
    estado: 'Pendiente',
  },
];
