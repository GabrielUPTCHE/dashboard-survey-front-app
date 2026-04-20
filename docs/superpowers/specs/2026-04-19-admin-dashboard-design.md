# Admin Dashboard — Design Spec

**Date:** 2026-04-19
**Project:** dashboard-survey-front-app
**Backend:** dashboard-survey-backend-app (Spring Boot, JWT via HttpOnly cookie)
**Scope:** Login, Reportes, Asignación de Rutas, Gestión de Usuarios

---

## 1. Contexto y objetivos

Panel web para administradores del sistema de encuestas del Censo 2024. Permite ver el estado de las encuestas realizadas, asignar rutas a encuestadores y gestionar usuarios. Se usa principalmente desde escritorio, pero debe ser responsive.

Solo usuarios con rol `ADMIN` pueden acceder. Cualquier ruta sin sesión válida redirige a `/login`.

---

## 2. Stack

- **React 19 + Vite 7** — misma base que el PWA
- **React Router 7** — enrutamiento
- **Tailwind CSS 3** — mismos tokens de color del PWA
- **Framer Motion** — transiciones de página (opcional, ligero)

**Sin librerías de gráficas.** Las visualizaciones (barras y dona) se implementan con CSS puro (conic-gradient, flexbox) para mantener el bundle pequeño.

---

## 3. Colores y tipografía

Idénticos al PWA (`pwa-survey-front-app/tailwind.config.js`):

| Token | Valor |
|---|---|
| `primary` | `#1c74e9` |
| `surface` | `#f6f7f8` |
| `surface-container` | `#ffffff` |
| `on-surface` | `#0f172a` |
| `on-surface-variant` | `#475569` |
| `surface-container-highest` | `#e2e8f0` |

Estados de encuesta:
- Completada → `#10b981` (emerald-500)
- Pendiente → `#f59e0b` (amber-500)
- Sin asignar → `#ef4444` (red-500)
- En progreso → `#1c74e9` (primary)

Fuentes: Public Sans (display), Manrope (headline), Inter (body). Material Symbols Outlined desde CDN.

---

## 4. Auth y seguridad

### Backend auth
- **POST `/login`** — body: `{ email, password }`. El backend setea cookie `token` HttpOnly. Retorna `{ message, email }`.
- **No existe endpoint `/verify`** en el backend actual. El `AuthContext` mantiene estado en memoria (no persiste en localStorage). Al recargar página, `isAuthenticated` vuelve a `false` y el usuario debe volver a autenticarse — esto es el comportamiento esperado hasta que el backend exponga un endpoint de verificación. Cuando cualquier llamada protegida retorne 401, `apiFetch` lanza error y el componente redirige a `/login`.
- **No existe endpoint `/logout`** en el backend actual. El logout limpia el estado local del `AuthContext` y redirige a `/login`. Cuando el backend exponga `POST /logout`, se conecta en `auth.service.js`.

### AuthContext
Expone: `user`, `isAuthenticated`, `isLoading`, `login(userData)`, `logout()`.

`user` shape (derivado de la respuesta del login + claims del JWT):
```json
{
  "email": "string",
  "role": "ADMIN"
}
```

### ProtectedRoute
Redirige a `/login` si `!isAuthenticated`. Muestra spinner mientras `isLoading`.

### RoleRoute
Verifica `user.role === 'ADMIN'`. Si no, muestra pantalla "Sin acceso" (no redirige).

---

## 5. Layout

### AdminLayout (`src/layouts/AdminLayout.jsx`)

Barra superior fija (`h-14`), fondo `primary` (#1c74e9), color blanco:
- Izquierda: logo / ícono `analytics` + texto "Censo Admin"
- Centro: tabs de navegación — Dashboard · Rutas · Usuarios
- Derecha: nombre del usuario + botón logout

Contenido debajo del header con `pt-14`, scroll normal de página.

**Responsive:** en móvil los tabs del header se comprimen a íconos solamente.

---

## 6. Rutas

```
/login       → Login (sin AdminLayout, redirige a / si ya autenticado)
/            → ProtectedRoute → AdminLayout → Dashboard
/rutas       → ProtectedRoute → AdminLayout → AsignacionRutas
/usuarios    → ProtectedRoute → AdminLayout → Usuarios
```

---

## 7. Pantallas

### 7.1 Login (`src/pages/Login.jsx`)

- Layout centrado verticalmente, sin header.
- Campos: `email` (tipo email) + `contraseña` (tipo password).
- Submit → `authService.login({ email, password })` → `AuthContext.login(userData)` → navega a `/`.
- Error inline bajo el form (mismo patrón que PWA: fondo rose con ícono).
- Loading state en el botón (ícono girando + texto "Ingresando...").

### 7.2 Dashboard / Reportes (`src/pages/Dashboard.jsx`)

**Fila de KPIs** — 3 cards con borde izquierdo de color:
1. Total encuestas del mes (borde `primary`)
2. Tasa de completadas % (borde emerald)
3. Encuestadores activos hoy (borde slate)

**Gráfica de barras diaria** — encuestas por día de la semana actual. Barras CSS (flexbox + height % proporcional). Día actual resaltado con `primary`.

**Dona de estados** — CSS `conic-gradient` mostrando % Completadas / Pendientes / Sin asignar. Leyenda a la derecha.

**Tabla "Últimas encuestas"** — columnas: Sujeto, Encuestador, Fecha, Estado. Badge de color por estado. Paginación simple (10 por página).

**Mock data:** `src/data/mockReportes.js` — objeto con `kpis`, `porDia[]`, `porEstado{}`, `ultimasEncuestas[]`.

Cada sección tiene comentario con el endpoint futuro:
```js
// TODO: GET /api/reportes/resumen → { totalMes, tasaCompletadas, encuestadoresActivos }
// TODO: GET /api/reportes/por-dia?semana=YYYY-WW → [{ dia, cantidad }]
// TODO: GET /api/reportes/por-estado → { completadas, pendientes, sinAsignar }
// TODO: GET /api/encuestas/recientes?limit=10&page=0 → { data[], total }
```

### 7.3 Asignación de Rutas (`src/pages/AsignacionRutas.jsx`)

**Barra de filtros:**
- Input date (default: hoy)
- Dropdown de encuestador (cargado desde mock, futuro: `GET /api/usuarios?rol=encuestador`)
- Botón "Nueva ruta" (abre modal de creación)

**Tabla de rutas:** columnas: Sujeto / Dirección, Encuestador, Fecha, Estado, Acciones.
- Fila sin encuestador: badge rojo "Sin asignar" + botón azul "Asignar".
- Fila con encuestador: badge de estado + botón "Editar".
- Botón "Asignar" / "Editar" → abre **AssignModal**.

**AssignModal:**
- Campos: Sujeto (readonly si edición), Encuestador (dropdown), Fecha, Hora inicio, Hora fin.
- Guardar → actualiza estado local (mock). Comentario: `// TODO: POST /api/turnos` / `PUT /api/turnos/:id`.
- Cancelar / X cierra modal.

**Mock data:** `src/data/mockRutas.js` — array de rutas con sujeto embebido y encuestador nullable.

### 7.4 Gestión de Usuarios (`src/pages/Usuarios.jsx`)

**Tabla de usuarios:** columnas: Nombre completo, N° Identificación, Email, Rol, Estado, Acciones.
- Botón "Nuevo usuario" → abre **CreateUserModal**.
- Botón "Editar" por fila → futuro, por ahora deshabilitado con tooltip "Próximamente".

**CreateUserModal:**
- Campos: Nombre, Apellido, N° Identificación, Email, Contraseña, Rol (select, solo "ADMIN" disponible).
- Submit → `usersService.createUser(data)` → **`POST /api/users/create`** (endpoint real).
- Éxito: cierra modal + añade usuario al estado local + toast de confirmación.
- Error 400: muestra mensaje inline (el backend retorna texto plano en error).

**Lista inicial:** mock data en `src/data/mockUsuarios.js`.
Comentario: `// TODO: GET /api/users → [UserEntity[]]` para reemplazar mock con datos reales.

---

## 8. Capa de servicios (`src/services/`)

### `api.js`
```js
apiFetch(endpoint, options = {})
  - Base URL: import.meta.env.VITE_PATH
  - credentials: 'include' (cookie JWT)
  - Content-Type: application/json por defecto; omitido si body es FormData
  - !res.ok → lanza Error con mensaje del servidor o genérico
  - TypeError (sin red) → lanza Error "Sin conexión"
```

### `auth.service.js`
- `login({ email, password })` → POST `/login`
- `logout()` → solo limpia estado local (sin endpoint backend por ahora)

### `users.service.js`
- `createUser(data)` → POST `/api/users/create`

---

## 9. Mock data

```
src/data/
├── mockReportes.js   — kpis, porDia, porEstado, ultimasEncuestas
├── mockRutas.js      — array de rutas con sujeto y encuestador
└── mockUsuarios.js   — array de usuarios con rol y estado
```

Cada archivo exporta datos estáticos. Los componentes los importan directamente y tienen comentarios indicando qué llamada de API los reemplaza.

---

## 10. Variables de entorno

`.env` en la raíz del proyecto:
```
VITE_PATH=http://localhost:8080
```

(El backend Spring Boot corre en puerto 8080 por defecto.)

---

## 11. Estructura de archivos

```
dashboard-survey-front-app/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── layouts/
│   │   └── AdminLayout.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AsignacionRutas.jsx
│   │   └── Usuarios.jsx
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   └── ui/
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       ├── Spinner.jsx
│   │       └── Table.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   └── users.service.js
│   └── data/
│       ├── mockReportes.js
│       ├── mockRutas.js
│       └── mockUsuarios.js
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-19-admin-dashboard-design.md
```

---

## 12. Notas de implementación

- **CORS deshabilitado en el backend**: al iniciar desarrollo local, el backend necesita habilitar CORS para `http://localhost:5173`. El desarrollador del backend debe descomentar la config en `SecurityConfig.java`.
- **Sin endpoint verify**: el `AuthContext` no persiste sesión entre recargas. El usuario inicia sesión cada vez que recarga. Cuando el backend exponga `GET /api/auth/verify` o `/api/users/me`, agregar la llamada en el `useEffect` de montaje del `AuthContext` para restaurar sesión automáticamente.
- **Rol único**: el backend solo tiene `ADMIN` en `ERole`. El select de rol en el modal de creación de usuario muestra solo "ADMIN" hasta que el backend amplíe el enum.
- **Error 400 texto plano**: `usersService.createUser` captura la respuesta como texto cuando no es JSON válido.
