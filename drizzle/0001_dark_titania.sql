CREATE TABLE `petitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`templateType` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`numeroProcesso` varchar(100),
	`tribunal` varchar(255),
	`autor` varchar(255),
	`reu` varchar(255),
	`fatos` text,
	`fundamentosJuridicos` text,
	`pedidos` text,
	`valorCausa` varchar(50),
	`status` enum('rascunho','finalizada') NOT NULL DEFAULT 'rascunho',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `petitions_id` PRIMARY KEY(`id`)
);
