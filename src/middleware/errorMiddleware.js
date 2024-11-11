const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // Registrar el error en la consola (opcional)
    const status = err.status || 500;
    const message = err.message || 'Ocurrió un error en el servidor.';
    res.status(status).json({ error: message });
  };
  
  module.exports = errorMiddleware;
  