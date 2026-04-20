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
