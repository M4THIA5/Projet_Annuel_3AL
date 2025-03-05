-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Insert into "User"
INSERT INTO "User" ("id", "email", "name") VALUES (1, 'admin@admin.com', 'Admin');