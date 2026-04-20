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
