-- CreateIndex
CREATE FULLTEXT INDEX `Admin_firstName_idx` ON `Admin`(`firstName`);

-- CreateIndex
CREATE FULLTEXT INDEX `Admin_lastName_idx` ON `Admin`(`lastName`);

-- CreateIndex
CREATE FULLTEXT INDEX `Admin_firstName_lastName_idx` ON `Admin`(`firstName`, `lastName`);
