-- Preserve existing closure records while allowing them to be reopened.
ALTER TABLE `MesFechado` ADD COLUMN `status` ENUM('ENCERRADO', 'ABERTO') NOT NULL DEFAULT 'ENCERRADO';
