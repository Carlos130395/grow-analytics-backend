const { check } = require("express-validator");

const createUserValidators = [
  check("usuario")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio."),
  check("correo")
    .isEmail()
    .withMessage("Debe ser un correo electrónico válido."),
  check("contrasena")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres.")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número."),
  check("nombre").notEmpty().withMessage("El nombre es obligatorio."),
  check("apell_paterno")
    .notEmpty()
    .withMessage("El apellido paterno es obligatorio."),
  check("apell_materno")
    .notEmpty()
    .withMessage("El apellido materno es obligatorio."),
];

module.exports = {
  createUserValidators,
};
