# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el panel de administrador `dashboard-survey-front-app` con login, reportes con KPIs y gráficas CSS, asignación de rutas y gestión de usuarios, conectado al backend Spring Boot `dashboard-survey-backend-app`.

**Architecture:** React 19 + Vite + React Router 7 + Tailwind CSS 3. Auth via cookie HttpOnly (Spring Boot). Datos de reportes y rutas servidos desde mock data con comentarios listos para conectar endpoints reales. Solo la pantalla de creación de usuarios usa un endpoint real (`POST /api/users/create`).

**Tech Stack:** React 19, Vite 7, React Router 7, Tailwind CSS 3, Material Symbols Outlined (CDN). Sin librerías de gráficas — visualizaciones con CSS puro.

---

## File Map

```
dashboard-survey-front-app/
├── index.html                          CREATE — entry HTML, carga fuentes y Material Symbols
├── vite.config.js                      CREATE — Vite config con proxy /api → localhost:8080
├── tailwind.config.js                  CREATE — tokens idénticos al PWA
├── postcss.config.js                   CREATE — postcss con tailwind y autoprefixer
├── .env.example                        CREATE — VITE_PATH=http://localhost:8080
├── .gitignore                          CREATE — node_modules, dist, .env
├── package.json                        CREATE — dependencias React, Vite, Tailwind, React Router
├── src/
│   ├── main.jsx                        CREATE — entry point, monta <App /> en #root
│   ├── index.css                       CREATE — @tailwind directives + CSS variables
│   ├── App.jsx                         CREATE — rutas: /login, /, /rutas, /usuarios
│   ├── context/
│   │   └── AuthContext.jsx             CREATE — user, isAuthenticated, isLoading, login(), logout()
│   ├── layouts/
│   │   └── AdminLayout.jsx             CREATE — header top nav azul + outlet
│   ├── components/
│   │   ├── ProtectedRoute.jsx          CREATE — redirige a /login si !isAuthenticated
│   │   └── ui/
│   │       ├── Badge.jsx               CREATE — variantes: primary, success, warning, danger, neutral
│   │       ├── Button.jsx              CREATE — variantes: primary, ghost, danger + loading state
│   │       ├── Modal.jsx               CREATE — overlay + contenido centrado + prop onClose
│   │       ├── Spinner.jsx             CREATE — ícono sync girando con animate-spin
│   │       └── Table.jsx               CREATE — thead/tbody con estilos consistentes
│   ├── services/
│   │   ├── api.js                      CREATE — apiFetch con credentials:include y manejo de errores
│   │   ├── auth.service.js             CREATE — login() POST /login
│   │   └── users.service.js            CREATE — createUser() POST /api/users/create
│   ├── data/
│   │   ├── mockReportes.js             CREATE — kpis, porDia[], porEstado{}, ultimasEncuestas[]
│   │   ├── mockRutas.js                CREATE — array de rutas con sujeto y encuestador nullable
│   │   └── mockUsuarios.js             CREATE — array de usuarios con rol y estado
│   └── pages/
│       ├── Login.jsx                   CREATE — form email+password, llama authService.login()
│       ├── Dashboard.jsx               CREATE — KPIs + gráfica barras + dona + tabla encuestas
│       ├── AsignacionRutas.jsx         CREATE — filtros + tabla rutas + modal asignación
│       └── Usuarios.jsx                CREATE — tabla usuarios + modal creación (endpoint real)
```

---

## Task 1: Scaffolding del proyecto

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `.env.example`
- Create: `.gitignore`

- [ ] **Step 1.1: Crear package.json**

```json
{
  "name": "dashboard-survey-front-app",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.5.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.4.1",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "vite": "^7.0.0"
  }
}
```

- [ ] **Step 1.2: Instalar dependencias**

```bash
cd dashboard-survey-front-app
npm install
```

- [ ] **Step 1.3: Crear vite.config.js**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 1.4: Crear tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1c74e9',
        'primary-container': '#eff6ff',
        'on-primary-container': '#1e3a8a',
        'secondary-container': '#dbeafe',
        'on-secondary-container': '#1d4ed8',
        surface: '#f6f7f8',
        'on-surface': '#0f172a',
        'on-surface-variant': '#475569',
        'surface-container-highest': '#e2e8f0',
        'surface-container': '#ffffff',
        'surface-dark': '#111821',
        'surface-container-dark': '#1e293b',
        'outline-variant': '#cbd5e1',
      },
      fontFamily: {
        display: ['Public Sans', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 1.5: Crear postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 1.6: Crear index.html**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Censo Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Manrope:wght@700;800&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 1.7: Crear .env.example y .env**

`.env.example`:
```
VITE_PATH=http://localhost:8080
```

`.env` (mismo contenido — no commitear):
```
VITE_PATH=http://localhost:8080
```

- [ ] **Step 1.8: Crear .gitignore**

```
node_modules
dist
.env
.env.local
.superpowers/
```

- [ ] **Step 1.9: Crear src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-header: #1c74e9;
}

#root {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
```

- [ ] **Step 1.10: Crear src/main.jsx**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 1.11: Commit**

```bash
git add -A
git commit -m "feat: scaffold project with Vite, React, Tailwind"
```

---

## Task 2: Capa de servicios

**Files:**
- Create: `src/services/api.js`
- Create: `src/services/auth.service.js`
- Create: `src/services/users.service.js`

- [ ] **Step 2.1: Crear src/services/api.js**

```js
const BASE_URL = import.meta.env.VITE_PATH;

if (!BASE_URL) {
  throw new Error('[api] VITE_PATH no está definido. Revisa tu archivo .env.');
}

export async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });

    if (!res.ok) {
      let message = `Error ${res.status}`;
      try {
        const text = await res.text();
        try {
          const err = JSON.parse(text);
          message = err.message || err.error || message;
        } catch {
          if (text) message = text;
        }
      } catch (_) {}
      throw new Error(message);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (
      error instanceof TypeError &&
      (error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError'))
    ) {
      throw new Error('Sin conexión. Verifica tu red.');
    }
    throw error;
  }
}
```

- [ ] **Step 2.2: Crear src/services/auth.service.js**

```js
import { apiFetch } from './api.js';

export const authService = {
  // POST /login — body: { email, password }
  // Respuesta: { message: "Autenticación correcta", email: string }
  // El backend setea cookie HttpOnly "token"
  login: ({ email, password }) =>
    apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Sin endpoint de logout en el backend por ahora.
  // TODO: cuando el backend exponga POST /logout, descomentar:
  // logout: () => apiFetch('/logout', { method: 'POST' }),
};
```

- [ ] **Step 2.3: Crear src/services/users.service.js**

```js
import { apiFetch } from './api.js';

export const usersService = {
  // POST /api/users/create — requiere ROLE_ADMIN (cookie token)
  // Body: { numberIdentification, name, lastName, email, password, role }
  // Éxito 200: UserEntity { numberIdentification, name, lastName, email, state, role: { id, name } }
  // Error 400: texto plano con el mensaje de error
  createUser: (data) =>
    apiFetch('/api/users/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // TODO: GET /api/users → UserEntity[] — listar todos los usuarios
  // getUsers: () => apiFetch('/api/users'),
};
```

- [ ] **Step 2.4: Commit**

```bash
git add src/services/
git commit -m "feat: add api fetch base and auth/users services"
```

---

## Task 3: AuthContext y ProtectedRoute

**Files:**
- Create: `src/context/AuthContext.jsx`
- Create: `src/components/ProtectedRoute.jsx`

- [ ] **Step 3.1: Crear src/context/AuthContext.jsx**

```jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // user shape: { email: string, role: string }
  // No persiste entre recargas — el usuario debe volver a autenticarse.
  // TODO: cuando el backend exponga GET /api/auth/verify o /api/users/me,
  // agregar useEffect que llame ese endpoint para restaurar sesión automáticamente.

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
```

- [ ] **Step 3.2: Crear src/components/ProtectedRoute.jsx**

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
```

- [ ] **Step 3.3: Commit**

```bash
git add src/context/ src/components/ProtectedRoute.jsx
git commit -m "feat: add AuthContext and ProtectedRoute"
```

---

## Task 4: Componentes UI

**Files:**
- Create: `src/components/ui/Badge.jsx`
- Create: `src/components/ui/Button.jsx`
- Create: `src/components/ui/Modal.jsx`
- Create: `src/components/ui/Spinner.jsx`
- Create: `src/components/ui/Table.jsx`

- [ ] **Step 4.1: Crear src/components/ui/Spinner.jsx**

```jsx
export default function Spinner({ className = '' }) {
  return (
    <span
      className={`material-symbols-outlined animate-spin text-primary ${className}`}
    >
      sync
    </span>
  );
}
```

- [ ] **Step 4.2: Crear src/components/ui/Badge.jsx**

```jsx
const variants = {
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-rose-100 text-rose-800',
  neutral: 'bg-slate-100 text-slate-700',
};

export default function Badge({ variant = 'neutral', children }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant] ?? variants.neutral}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4.3: Crear src/components/ui/Button.jsx**

```jsx
import Spinner from './Spinner.jsx';

const variants = {
  primary: 'bg-primary text-white hover:opacity-90 shadow-sm shadow-primary/20',
  ghost: 'bg-transparent text-primary border border-primary/30 hover:bg-primary/5',
  danger: 'bg-rose-500 text-white hover:opacity-90',
};

export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
        font-semibold text-sm transition-all active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant] ?? variants.primary}
        ${className}
      `}
      {...props}
    >
      {loading && <Spinner className="text-current text-base" />}
      {children}
    </button>
  );
}
```

- [ ] **Step 4.4: Crear src/components/ui/Modal.jsx**

```jsx
import { useEffect } from 'react';

export default function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-highest">
          <h2 className="text-on-surface font-bold text-lg font-headline">{title}</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-surface-container-highest flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4.5: Crear src/components/ui/Table.jsx**

```jsx
export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-surface-container-highest bg-surface-container ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Thead({ children }) {
  return (
    <thead className="bg-slate-50 border-b border-surface-container-highest">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-surface-container-highest">{children}</tbody>;
}

export function Td({ children, className = '', ...props }) {
  return (
    <td className={`px-4 py-3 text-on-surface text-sm ${className}`} {...props}>
      {children}
    </td>
  );
}
```

- [ ] **Step 4.6: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add UI primitives Badge, Button, Modal, Spinner, Table"
```

---

## Task 5: AdminLayout

**Files:**
- Create: `src/layouts/AdminLayout.jsx`

- [ ] **Step 5.1: Crear src/layouts/AdminLayout.jsx**

```jsx
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
```

- [ ] **Step 5.2: Commit**

```bash
git add src/layouts/AdminLayout.jsx
git commit -m "feat: add AdminLayout with top nav"
```

---

## Task 6: Mock data

**Files:**
- Create: `src/data/mockReportes.js`
- Create: `src/data/mockRutas.js`
- Create: `src/data/mockUsuarios.js`

- [ ] **Step 6.1: Crear src/data/mockReportes.js**

```js
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
```

- [ ] **Step 6.2: Crear src/data/mockRutas.js**

```js
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
// Ruta: { id, sujeto: { nombre, direccion, barrio, zona }, encuestadorId, encuestadorNombre, fecha, horaInicio, horaFin, estado }
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
```

- [ ] **Step 6.3: Crear src/data/mockUsuarios.js**

```js
// Mock data para la pantalla de Gestión de Usuarios.
// La lista inicial se sirve desde aquí hasta que el backend exponga GET /api/users.

// TODO: GET /api/users → UserEntity[]
// UserEntity: { numberIdentification, name, lastName, email, state, role: { id, name } }

export const mockUsuarios = [
  {
    numberIdentification: '9000000001',
    name: 'Administrador',
    lastName: 'Principal',
    email: 'admin@censo.gov.co',
    state: true,
    role: { id: 1, name: 'ADMIN' },
  },
  {
    numberIdentification: '9000000002',
    name: 'Laura',
    lastName: 'Ramírez',
    email: 'laura.ramirez@censo.gov.co',
    state: true,
    role: { id: 1, name: 'ADMIN' },
  },
  {
    numberIdentification: '9000000003',
    name: 'Diego',
    lastName: 'Herrera',
    email: 'diego.herrera@censo.gov.co',
    state: false,
    role: { id: 1, name: 'ADMIN' },
  },
];
```

- [ ] **Step 6.4: Commit**

```bash
git add src/data/
git commit -m "feat: add mock data for reports, routes and users"
```

---

## Task 7: Página de Login

**Files:**
- Create: `src/pages/Login.jsx`

- [ ] **Step 7.1: Crear src/pages/Login.jsx**

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/auth.service.js';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // POST /login → { message, email }
      const data = await authService.login({ email: form.email, password: form.password });
      login({ email: data.email, role: 'ADMIN' });
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-6 font-display">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-4xl">analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight font-headline">Censo Admin</h1>
          <p className="text-sm text-on-surface-variant mt-1">Panel de administración</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant ml-1">
              Correo electrónico
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full h-14 px-4 rounded-xl border border-primary/20 bg-surface-container text-on-surface focus:ring-2 focus:ring-primary outline-none transition"
              placeholder="admin@censo.gov.co"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant ml-1">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full h-14 px-4 rounded-xl border border-primary/20 bg-surface-container text-on-surface focus:ring-2 focus:ring-primary outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200">
              <span className="material-symbols-outlined text-rose-500 text-lg shrink-0">error</span>
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95 mt-2 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {loading
              ? <><span className="material-symbols-outlined animate-spin">sync</span> Ingresando...</>
              : <><span className="material-symbols-outlined">login</span> Ingresar</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 7.2: Commit**

```bash
git add src/pages/Login.jsx
git commit -m "feat: add Login page with email+password form"
```

---

## Task 8: App.jsx con routing

**Files:**
- Create: `src/App.jsx`

- [ ] **Step 8.1: Crear src/App.jsx**

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AsignacionRutas from './pages/AsignacionRutas.jsx';
import Usuarios from './pages/Usuarios.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="rutas" element={<AsignacionRutas />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

- [ ] **Step 8.2: Verificar que el proyecto arranca sin errores**

```bash
npm run dev
```

Abrir `http://localhost:5174`. Debe redirigir a `/login` automáticamente.

- [ ] **Step 8.3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add routing with ProtectedRoute and AdminLayout"
```

---

## Task 9: Pantalla Dashboard / Reportes

**Files:**
- Create: `src/pages/Dashboard.jsx`

- [ ] **Step 9.1: Crear src/pages/Dashboard.jsx**

```jsx
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
```

- [ ] **Step 9.2: Verificar en el navegador**

Iniciar sesión y verificar que el Dashboard muestra KPIs, gráfica de barras, dona y tabla.

- [ ] **Step 9.3: Commit**

```bash
git add src/pages/Dashboard.jsx
git commit -m "feat: add Dashboard with KPIs, bar chart, donut chart and table"
```

---

## Task 10: Pantalla Asignación de Rutas

**Files:**
- Create: `src/pages/AsignacionRutas.jsx`

- [ ] **Step 10.1: Crear src/pages/AsignacionRutas.jsx**

```jsx
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
                  estado: form.encuestadorId ? 'Pendiente' : 'Sin asignar',
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
        <Button onClick={openNueva}>
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
```

- [ ] **Step 10.2: Verificar en el navegador**

Navegar a `/rutas`. Verificar filtros, tabla, botón Asignar/Editar y modal funcionando.

- [ ] **Step 10.3: Commit**

```bash
git add src/pages/AsignacionRutas.jsx
git commit -m "feat: add AsignacionRutas with filter table and assign modal"
```

---

## Task 11: Pantalla Gestión de Usuarios

**Files:**
- Create: `src/pages/Usuarios.jsx`

- [ ] **Step 11.1: Crear src/pages/Usuarios.jsx**

```jsx
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
                <input name="name" value={form.name} onChange={handleChange} placeholder="Juan" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-on-surface-variant">Apellido</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="García" className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface-variant">N° Identificación</label>
              <input name="numberIdentification" value={form.numberIdentification} onChange={handleChange} placeholder="1234567890" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface-variant">Correo electrónico</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="usuario@censo.gov.co" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-on-surface-variant">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputClass} />
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
```

- [ ] **Step 11.2: Verificar en el navegador**

Navegar a `/usuarios`. Verificar tabla, botón "Nuevo usuario", modal con formulario y manejo de error.

- [ ] **Step 11.3: Build final**

```bash
npm run build
```

Verificar que termina sin errores.

- [ ] **Step 11.4: Commit final**

```bash
git add src/pages/Usuarios.jsx
git commit -m "feat: add Usuarios page with create user modal (real endpoint)"
```

---

## Checklist final de verificación

- [ ] `/login` — formulario con email/password, error inline, redirige a `/` al autenticar
- [ ] `/` — KPIs, gráfica de barras, dona de estados, tabla de últimas encuestas
- [ ] `/rutas` — filtros fecha/encuestador, tabla, modal asignar/editar funcional
- [ ] `/usuarios` — tabla mock, modal creación conectado a `POST /api/users/create`
- [ ] Header con tabs de navegación, responsive en móvil
- [ ] Ruta `*` redirige a `/`
- [ ] `npm run build` sin errores
