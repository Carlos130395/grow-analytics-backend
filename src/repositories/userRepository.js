const prisma = require('../prismaClient');

class UserRepository {
  async findAll(params) {
    try {
      return await prisma.usuario.findMany(params);
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async countUsers(where) {
    try {
      return await prisma.usuario.count({ where });
    } catch (error) {
      throw new Error(`Error al contar usuarios: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await prisma.usuario.findUnique({ where: { id: parseInt(id) } });
    } catch (error) {
      throw new Error(`Error al buscar el usuario con ID ${id}: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await prisma.usuario.findUnique({ where: { correo: email } }); // Cambié 'usuario' por 'correo' para reflejar búsqueda por correo
    } catch (error) {
      throw new Error(`Error al buscar el usuario con correo ${email}: ${error.message}`);
    }
  }

  async create(user) {
    try {
      return await prisma.usuario.create({ data: user });
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      return await prisma.usuario.update({ where: { id: parseInt(id) }, data });
    } catch (error) {
      throw new Error(`Error al actualizar el usuario con ID ${id}: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await prisma.usuario.delete({ where: { id: parseInt(id) } });
    } catch (error) {
      throw new Error(`Error al eliminar el usuario con ID ${id}: ${error.message}`);
    }
  }
}

module.exports = new UserRepository();
