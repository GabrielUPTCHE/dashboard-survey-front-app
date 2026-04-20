import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const tabs = [
  { to: '/', label: 'Dashboard', icon: 'bar_chart', end: true },
  { to: '/rutas', label: 'Rutas', icon: 'map' },
  { to: '/usuarios', label: 'Usuarios', icon: 'group' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface font-body">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 bg-primary text-white flex items-center px-6 gap-6 shadow-md">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-2xl">analytics</span>
          <span className="font-headline font-bold text-base hidden sm:block">Censo Admin</span>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center gap-1 flex-1">
          {tabs.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <span className="material-symbols-outlined text-base">{icon}</span>
              <span className="hidden md:block">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm text-white/80 hidden sm:block">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm"
            title="Cerrar sesión"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span className="hidden md:block">Salir</span>
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="pt-14 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
