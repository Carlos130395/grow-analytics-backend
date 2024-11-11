-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apell_paterno` VARCHAR(191) NOT NULL,
    `apell_materno` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(191) NOT NULL,
    `tipo_usuario` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_usuario_key`(`usuario`),
    UNIQUE INDEX `Usuario_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
