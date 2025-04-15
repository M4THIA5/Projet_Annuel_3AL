-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Insert into User with password: admin
INSERT INTO "User" ("id", "email", "name", "password", "isAdmin") VALUES (1, 'admin@admin.io', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$bZphdsSPXtFlMUE6QmxcjA$1S0Y7Ln83OZAt0nXMNjnEy/xzZlvUHWb+Jc6POlx3I8', true);
INSERT INTO "User" ("id", "email", "name", "password", "isAdmin") VALUES (2, 'mathias@admin.io', 'mathias', '$argon2id$v=19$m=65536,t=3,p=4$63r4ah/NE04tdYS+fcEa3A$5hdq2d1bIrM49ECtmvfYx095Zvm/0X+KafgBfDvwsR8', true);
