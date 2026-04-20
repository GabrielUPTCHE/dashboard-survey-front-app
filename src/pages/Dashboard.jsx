import { mockKpis, mockPorDia, mockPorEstado, mockUltimasEncuestas } from '../data/mockReportes.js';
import Badge from '../components/ui/Badge.jsx';
import { Table, Thead, Th, Tbody, Td } from '../components/ui/Table.jsx';

const estadoVariant = (estado) => {
  if (estado === 'Completada') return 'success';
  if (estado === 'En Progreso') return 'primary';
  if (estado === 'Pendiente') return 'warning';
  if (estado === 'Sin asignar') return 'danger';
  return 'neutral';
};

function KpiCard({ label, value, sub, borderColor }) {
  return (
    <div className={`bg-surface-container rounded-xl border border-surface-container-highest p-5 border-l-4 ${borderColor}`}>
      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-on-surface font-headline">{value}</p>
      {sub && <p className="text-xs text-on-surface-variant mt-1">{sub}</p>}
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.cantidad));
  const today = new Date().toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', '');
  return (
    <div className="bg-surface-container rounded-xl border border-surface-container-highest p-5">
      <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Encuestas por día</h3>
      <div className="flex items-end gap-2 h-32">
        {data.map(({ dia, cantidad }) => {
          const height = max > 0 ? Math.round((cantidad / max) * 100) : 0;
          const isToday = dia.toLowerCase().startsWith(today.toLowerCase());
          return (
            <div key={dia} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs font-semibold text-on-surface-variant">{cantidad}</span>
              <div
                className={`w-full rounded-t-md transition-all ${isToday ? 'bg-primary' : 'bg-primary/25'}`}
                style={{ height: `${height}%`, minHeight: '4px' }}
              />
              <span className={`text-xs font-semibold ${isToday ? 'text-primary' : 'text-on-surface-variant'}`}>{dia}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonutChart({ data }) {
  const total = data.completadas + data.pendientes + data.sinAsignar;
  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);
  const completadasPct = pct(data.completadas);
  const pendientesPct = pct(data.pendientes);
  const sinAsignarPct = pct(data.sinAsignar);

  const gradient = `conic-gradient(
    #10b981 0% ${completadasPct}%,
    #f59e0b ${completadasPct}% ${completadasPct + pendientesPct}%,
    #ef4444 ${completadasPct + pendientesPct}% 100%
  )`;

  return (
    <div className="bg-surface-container rounded-xl border border-surface-container-highest p-5">
      <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Estado encuestas</h3>
      <div className="flex items-center gap-6">
        <div
          className="shrink-0 rounded-full"
          style={{ width: 96, height: 96, background: gradient }}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, white 55%, transparent 55%)' }}>
            <span className="text-sm font-bold text-on-surface">{completadasPct}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
            <span className="text-on-surface-variant">Completadas</span>
            <span className="font-bold text-on-surface ml-auto pl-4">{data.completadas}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500 shrink-0" />
            <span className="text-on-surface-variant">Pendientes</span>
            <span className="font-bold text-on-surface ml-auto pl-4">{data.pendientes}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500 shrink-0" />
            <span className="text-on-surface-variant">Sin asignar</span>
            <span className="font-bold text-on-surface ml-auto pl-4">{data.sinAsignar}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // TODO: reemplazar mockKpis con: const [kpis, setKpis] = useState(null);
  // useEffect(() => { apiFetch('/api/reportes/resumen').then(setKpis); }, []);

  // TODO: reemplazar mockPorDia con: apiFetch('/api/reportes/por-dia?semana=...')

  // TODO: reemplazar mockPorEstado con: apiFetch('/api/reportes/por-estado')

  // TODO: reemplazar mockUltimasEncuestas con: apiFetch('/api/encuestas/recientes?limit=10&page=0')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-on-surface font-headline">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Total encuestas (mes)"
          value={mockKpis.totalMes}
          sub={`${mockKpis.tendenciaSemana > 0 ? '▲' : '▼'} ${Math.abs(mockKpis.tendenciaSemana)}% vs. semana anterior`}
          borderColor="border-l-primary"
        />
        <KpiCard
          label="Tasa de completadas"
          value={`${mockKpis.tasaCompletadas}%`}
          sub={`${mockPorEstado.completadas} de ${mockKpis.totalMes} encuestas`}
          borderColor="border-l-emerald-500"
        />
        <KpiCard
          label="Encuestadores activos hoy"
          value={mockKpis.encuestadoresActivos}
          borderColor="border-l-slate-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChart data={mockPorDia} />
        <DonutChart data={mockPorEstado} />
      </div>

      {/* Últimas encuestas */}
      <div>
        <h2 className="text-lg font-bold text-on-surface font-headline mb-3">Últimas encuestas</h2>
        <Table>
          <Thead>
            <Th>Sujeto</Th>
            <Th>Encuestador</Th>
            <Th>Fecha</Th>
            <Th>Estado</Th>
          </Thead>
          <Tbody>
            {mockUltimasEncuestas.map((enc) => (
              <tr key={enc.id} className="hover:bg-slate-50 transition-colors">
                <Td>
                  <p className="font-semibold text-on-surface">{enc.sujetoNombre}</p>
                  <p className="text-xs text-on-surface-variant">{enc.direccion}</p>
                </Td>
                <Td>{enc.encuestador ?? <span className="text-on-surface-variant italic">Sin asignar</span>}</Td>
                <Td>{enc.fecha}</Td>
                <Td>
                  <Badge variant={estadoVariant(enc.estado)}>{enc.estado}</Badge>
                </Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
