-- CreateTable
CREATE TABLE `Users` (
    `username` VARCHAR(50) NOT NULL,
    `passhash` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profiles` (
    `username` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `emailAddress` VARCHAR(191) NOT NULL,
    `emailVerified` TINYINT NOT NULL,
    `avatar` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Profiles_username_key`(`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logs` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `msg` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Logs_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Workflows` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,

    UNIQUE INDEX `Workflows_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Projects` (
    `id` VARCHAR(191) NOT NULL,
    `parent` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NULL,
    `order` INTEGER NOT NULL,
    `priority` SMALLINT NOT NULL DEFAULT 1,
    `tagsIDs` JSON NOT NULL,

    UNIQUE INDEX `Projects_id_key`(`id`),
    UNIQUE INDEX `Projects_parent_order_key`(`parent`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Goals` (
    `id` VARCHAR(191) NOT NULL,
    `parent` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NULL,
    `order` INTEGER NOT NULL,
    `priority` SMALLINT NOT NULL DEFAULT 1,
    `tagsIDs` JSON NOT NULL,

    UNIQUE INDEX `Goals_parent_order_key`(`parent`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subgoals` (
    `id` VARCHAR(191) NOT NULL,
    `parent` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NULL,
    `order` INTEGER NOT NULL,
    `priority` SMALLINT NOT NULL DEFAULT 1,
    `tagsIDs` JSON NOT NULL,

    UNIQUE INDEX `Subgoals_parent_order_key`(`parent`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tags` (
    `username` VARCHAR(50) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `fontclr` VARCHAR(7) NOT NULL,
    `bgclr` VARCHAR(7) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `bgimg` VARCHAR(191) NULL,

    UNIQUE INDEX `Tags_id_key`(`id`),
    UNIQUE INDEX `Tags_fontclr_bgclr_key`(`fontclr`, `bgclr`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profiles` ADD CONSTRAINT `Profiles_username_fkey` FOREIGN KEY (`username`) REFERENCES `Users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Workflows` ADD CONSTRAINT `Workflows_username_fkey` FOREIGN KEY (`username`) REFERENCES `Users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Projects` ADD CONSTRAINT `Projects_parent_fkey` FOREIGN KEY (`parent`) REFERENCES `Workflows`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Projects` ADD CONSTRAINT `Projects_username_fkey` FOREIGN KEY (`username`) REFERENCES `Users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goals` ADD CONSTRAINT `Goals_parent_fkey` FOREIGN KEY (`parent`) REFERENCES `Projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goals` ADD CONSTRAINT `Goals_username_fkey` FOREIGN KEY (`username`) REFERENCES `Users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subgoals` ADD CONSTRAINT `Subgoals_parent_fkey` FOREIGN KEY (`parent`) REFERENCES `Goals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subgoals` ADD CONSTRAINT `Subgoals_username_fkey` FOREIGN KEY (`username`) REFERENCES `Users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tags` ADD CONSTRAINT `Tags_username_fkey` FOREIGN KEY (`username`) REFERENCES `Users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
