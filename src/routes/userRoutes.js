const express = require('express');
const { check, validationResult } = require('express-validator');
const { getUsers, getUser, createUser, updateUser, deleteUser, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware'); // Importar el middleware de roles

const router = express.Router();

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers); // Solo los usuarios con tipo 'admin' pueden acceder

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'user']), getUser); // Solo usuarios con tipo 'admin' o 'manager'

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       500:
 *         description: Error al crear el usuario
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']), // Solo los usuarios con tipo 'admin' pueden crear nuevos usuarios
  [
    // Validaciones para crear un usuario
    check('usuario').notEmpty().withMessage('El nombre de usuario es obligatorio.'),
    check('correo').isEmail().withMessage('Debe ser un correo electrónico válido.'),
    check('contrasena')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres.')
      .matches(/\d/)
      .withMessage('La contraseña debe contener al menos un número.'),
    check('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    check('apell_paterno').notEmpty().withMessage('El apellido paterno es obligatorio.'),
    check('apell_materno').notEmpty().withMessage('El apellido materno es obligatorio.'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createUser
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el usuario
 */
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'user']), updateUser); // Solo usuarios con tipo 'admin' o 'manager'

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar el usuario
 */
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser); // Solo usuarios con tipo 'admin'

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post(
  '/login',
  [
    // Validaciones para iniciar sesión
    check('correo').isEmail().withMessage('Debe ser un correo electrónico válido.'),
    check('contrasena').notEmpty().withMessage('La contraseña es obligatoria.'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  loginUser
);

module.exports = router;
