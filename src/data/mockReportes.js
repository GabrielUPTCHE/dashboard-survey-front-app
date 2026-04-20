// Mock data para la pantalla de Reportes / Dashboard.
// Reemplazar cada sección con la llamada a la API correspondiente cuando el backend la exponga.

// TODO: GET /api/reportes/resumen → { totalMes, tasaCompletadas, encuestadoresActivos }
export const mockKpis = {
  totalMes: 312,
  tasaCompletadas: 75,       // porcentaje 0-100
  encuestadoresActivos: 8,
  tendenciaSemana: +12,      // % vs semana anterior
};

// TODO: GET /api/reportes/por-dia?semana=YYYY-WW → [{ dia: "Lun", cantidad: number }]
export const mockPorDia = [
  { dia: 'Lun', cantidad: 48 },
  { dia: 'Mar', cantidad: 62 },
  { dia: 'Mié', cantidad: 55 },
  { dia: 'Jue', cantidad: 71 },
  { dia: 'Vie', cantidad: 43 },
  { dia: 'Sáb', cantidad: 21 },
  { dia: 'Dom', cantidad: 12 },
];

// TODO: GET /api/reportes/por-estado → { completadas: number, pendientes: number, sinAsignar: number }
export const mockPorEstado = {
  completadas: 234,
  pendientes: 62,
  sinAsignar: 16,
};

// TODO: GET /api/encuestas/recientes?limit=10&page=0 → { data: Encuesta[], total: number }
// Encuesta: { id, sujetoNombre, direccion, encuestador, fecha, estado }
export const mockUltimasEncuestas = [
  { id: 1, sujetoNombre: 'Panadería El Trigo', direccion: 'Calle 45 # 12-34', encuestador: 'Juan García', fecha: '2026-04-19', estado: 'Completada' },
  { id: 2, sujetoNombre: 'Tienda La Esquina', direccion: 'Av. Principal # 3-10', encuestador: 'María López', fecha: '2026-04-19', estado: 'Pendiente' },
  { id: 3, sujetoNombre: 'Ferretería Centro', direccion: 'Carrera 8 # 5-20', encuestador: 'Carlos Ruiz', fecha: '2026-04-18', estado: 'Completada' },
  { id: 4, sujetoNombre: 'Supermercado Norte', direccion: 'Calle 12 # 8-45', encuestador: 'Ana Martínez', fecha: '2026-04-18', estado: 'En Progreso' },
  { id: 5, sujetoNombre: 'Droguería Salud', direccion: 'Cra 15 # 20-10', encuestador: null, fecha: '2026-04-18', estado: 'Sin asignar' },
  { id: 6, sujetoNombre: 'Restaurante El Buen Sabor', direccion: 'Calle 30 # 6-18', encuestador: 'Juan García', fecha: '2026-04-17', estado: 'Completada' },
  { id: 7, sujetoNombre: 'Papelería Escolar', direccion: 'Carrera 5 # 14-22', encuestador: 'María López', fecha: '2026-04-17', estado: 'Completada' },
  { id: 8, sujetoNombre: 'Café Central', direccion: 'Calle 10 # 9-33', encuestador: 'Pedro Gómez', fecha: '2026-04-17', estado: 'Pendiente' },
  { id: 9, sujetoNombre: 'Zapatería Moderna', direccion: 'Av. 68 # 24-5', encuestador: null, fecha: '2026-04-16', estado: 'Sin asignar' },
  { id: 10, sujetoNombre: 'Librería Universal', direccion: 'Calle 19 # 3-55', encuestador: 'Ana Martínez', fecha: '2026-04-16', estado: 'Completada' },
];
