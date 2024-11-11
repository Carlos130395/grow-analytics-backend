const request = require('supertest');
const app = require('../server'); // Importa tu aplicación Express
const prisma = require('../prismaClient'); // Importa tu cliente Prisma
const jwt = require('jsonwebtoken');

// Genera un token de autenticación válido para las pruebas
const token = jwt.sign({ id: 1, tipo_usuario: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Datos de prueba para insertar en la base de datos
const mockUsers = [
  {
    id: 1,
    usuario: 'usuario1',
    correo: 'usuario1@example.com',
    nombre: 'Juan',
    apell_paterno: 'Pérez',
    apell_materno: 'Gómez',
    contrasena: 'hashedpassword',
    tipo_usuario: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    usuario: 'usuario2',
    correo: 'usuario2@example.com',
    nombre: 'María',
    apell_paterno: 'López',
    apell_materno: 'Rodríguez',
    contrasena: 'hashedpassword',
    tipo_usuario: 'user',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

describe('GET /api/usuarios', () => {
  beforeAll(async () => {
    try {
      // Limpia la base de datos y agrega datos de prueba
      await prisma.usuario.deleteMany({});
      await prisma.usuario.createMany({ data: mockUsers });
      const users = await prisma.usuario.findMany(); // Verificar inserción
      console.log('Usuarios insertados:', users); // Depuración
    } catch (error) {
      console.error('Error al insertar datos de prueba:', error);
    }
  });

  afterAll(async () => {
    // Limpieza después de todas las pruebas
    await prisma.usuario.deleteMany({});
    await prisma.$disconnect();
  });

  it('debería devolver una lista de usuarios con paginación', async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`) // Agregar el token de autorización
      .query({ page: 1, pageSize: 2 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2); // Ajustar si el número esperado es diferente
    expect(response.body.pagination.total).toBeGreaterThanOrEqual(2);
  });

  it('debería devolver una lista ordenada de usuarios', async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`) // Agregar el token de autorización
      .query({ sortBy: 'nombre', order: 'asc' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data[0].nombre).toBe('Juan');
  });

  it('debería devolver usuarios que coincidan con el filtro', async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`) // Agregar el token de autorización
      .query({ filter: 'Juan' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data[0].nombre).toBe('Juan');
  });
});
