const UserService = require("../services/userService");

const getUsers = async (req, res, next) => {
  try {
    // Obtener parámetros de consulta
    const {
      page = 1,
      pageSize = 10,
      sortBy = "id",
      order = "asc",
      filter = "",
    } = req.query;

    // Llamar al servicio con los parámetros de paginación, ordenamiento y filtrado
    const users = await UserService.getUsers({
      page,
      pageSize,
      sortBy,
      order,
      filter,
    });

    res.status(200).json({
      success: true,
      data: users.data,
      pagination: {
        total: users.total,
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
      },
    });
  } catch (error) {
    next(error); // Pasar el error al middleware centralizado
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    // No es necesario verificar si el correo ya existe aquí, ya que se maneja en el servicio
    const user = await UserService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await UserService.deleteUser(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    res.status(200).json({ success: true, message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const { token, user } = await UserService.authenticateUser(
      correo,
      contrasena
    );
    res.status(200).json({ success: true, token, data: user });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
