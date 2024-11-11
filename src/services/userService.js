const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  async getUsers({ page, pageSize, sortBy, order, filter }) {
    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize, 10);
    const orderBy = { [sortBy]: order };

    // Definir la lógica de filtrado, puedes personalizarla según sea necesario
    const where = filter
      ? {
          OR: [
            { usuario: { contains: filter } },
            { correo: { contains: filter } },
            { nombre: { contains: filter } },
            { apell_paterno: { contains: filter } },
            { apell_materno: { contains: filter } },
          ],
        }
      : {};

    // Obtener el total de registros que coinciden con el filtro
    const total = await UserRepository.countUsers(where);

    // Obtener los usuarios con paginación, ordenamiento y filtrado
    const data = await UserRepository.findAll({ skip, take, orderBy, where });

    return { total, data };
  }

  async getUserById(id) {
    try {
      const user = await UserRepository.findById(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return user;
    } catch (error) {
      throw new Error(
        `Error al buscar el usuario con ID ${id}: ${error.message}`
      );
    }
  }

  async createUser(data) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await UserRepository.findByEmail(data.correo); // Suponiendo que correo es único
      if (existingUser) {
        throw new Error("El correo ya está registrado");
      }

      // Encriptar contraseña
      data.contrasena = await bcrypt.hash(data.contrasena, 10);
      return await UserRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  async updateUser(id, data) {
    try {
      const user = await UserRepository.update(id, data);
      if (!user) {
        throw new Error("Usuario no encontrado para actualizar");
      }
      return user;
    } catch (error) {
      throw new Error(
        `Error al actualizar el usuario con ID ${id}: ${error.message}`
      );
    }
  }

  async deleteUser(id) {
    try {
      const user = await UserRepository.delete(id);
      if (!user) {
        throw new Error("Usuario no encontrado para eliminar");
      }
      return user;
    } catch (error) {
      throw new Error(
        `Error al eliminar el usuario con ID ${id}: ${error.message}`
      );
    }
  }

  async authenticateUser(email, password) {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const validPassword = await bcrypt.compare(password, user.contrasena);
      if (!validPassword) {
        throw new Error("Contraseña incorrecta");
      }

      const token = jwt.sign(
        { id: user.id, tipo_usuario: user.tipo_usuario },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // Parametrizar la expiración del token
      );

      return { token, user };
    } catch (error) {
      throw new Error(`Error al autenticar el usuario: ${error.message}`);
    }
  }
}

module.exports = new UserService();
