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
