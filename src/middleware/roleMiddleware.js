const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
      const user = req.user; // req.user debe estar definido por el authMiddleware después de verificar el token
      if (!user) {
        return res.status(403).json({ error: 'Acceso denegado. No está autenticado.' });
      }
  
      // Verificar si el tipo de usuario está en los roles permitidos
      if (!requiredRoles.includes(user.tipo_usuario)) {
        return res.status(403).json({ error: 'Acceso denegado. No tiene permisos suficientes.' });
      }
  
      next(); // Si tiene permiso, continuar con la solicitud
    };
  };
  
  module.exports = roleMiddleware;
  