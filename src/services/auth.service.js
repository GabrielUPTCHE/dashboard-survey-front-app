import { apiFetch } from './api.js';

export const authService = {
  // POST /login — body: { email, password }
  // Respuesta: { message: "Autenticación correcta", email: string }
  // El backend setea cookie HttpOnly "token"
  // NOTA: la respuesta no incluye el rol — Login.jsx lo asume como 'ADMIN' hasta que el backend lo retorne
  login: ({ email, password }) =>
    apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Sin endpoint de logout en el backend por ahora.
  // TODO: cuando el backend exponga POST /logout, descomentar:
  // logout: () => apiFetch('/logout', { method: 'POST' }),
};
