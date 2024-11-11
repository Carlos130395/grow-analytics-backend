require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const errorMiddleware = require('./middleware/errorMiddleware'); // Importar middleware de errores
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet()); // Proteger cabeceras HTTP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 solicitudes por ventana
});
app.use(limiter);

app.use(cors());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Grow Analytics API",
      version: "1.0.0",
      description: "API para la gestión de usuarios",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Usuario: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID del usuario",
            },
            usuario: {
              type: "string",
              description: "Nombre de usuario",
            },
            correo: {
              type: "string",
              description: "Correo electrónico del usuario",
            },
            nombre: {
              type: "string",
              description: "Nombre del usuario",
            },
            apell_paterno: {
              type: "string",
              description: "Apellido paterno del usuario",
            },
            apell_materno: {
              type: "string",
              description: "Apellido materno del usuario",
            },
            contrasena: {
              type: "string",
              description: "Contraseña del usuario",
            },
            tipo_usuario: {
              type: "string",
              description: "Tipo de usuario",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación del usuario",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de última actualización del usuario",
            },
          },
          required: ["usuario", "correo", "contrasena"],
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Ruta para escanear anotaciones de Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use("/api/usuarios", userRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Middleware de manejo de errores
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

// Iniciar el servidor solo si no se requiere en pruebas
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app; // Exportar la instancia de app para las pruebas
