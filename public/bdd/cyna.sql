-- /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
-- brew install postgresql
-- brew services start postgresql
-- psql postgres
-- CREATE USER cynauser WITH PASSWORD 'azerty';
-- ALTER USER cynauser WITH CREATEDB;
-- exit
-- psql -U usera -d postgres -c "CREATE DATABASE cyna;"
-- psql -U usera -d cyna -f public/bdd/Creation.sql

-- Connect to the database
\c cyna;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Produit" CASCADE;
DROP TABLE IF EXISTS "Subscription" CASCADE;
DROP TABLE IF EXISTS "Panier" CASCADE;
DROP TABLE IF EXISTS "PreviousOrder" CASCADE;

-- Table User
CREATE TABLE "User" (
    "Id" SERIAL PRIMARY KEY,
    "mdp" VARCHAR(100) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "adresse" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL
);

-- Table Produit
CREATE TABLE "Produit" (
    "Id" SERIAL PRIMARY KEY,
    "Nom" VARCHAR(100) NOT NULL,
    "prix" DECIMAL(10, 2) NOT NULL,
    "description" TEXT
);

-- Table Subscription
CREATE TABLE "Subscription" (
    "Id" SERIAL PRIMARY KEY,
    "ProduitId" INT NOT NULL,
    "UserId" INT NOT NULL,
    "StartDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "EndDate" TIMESTAMP,
    FOREIGN KEY ("ProduitId") REFERENCES "Produit"("Id"),
    FOREIGN KEY ("UserId") REFERENCES "User"("Id")
);

-- Table Panier
CREATE TABLE "Panier" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INT NOT NULL,
    "ProduitId" INT NOT NULL,
    "Quantite" INT DEFAULT 1,
    FOREIGN KEY ("UserId") REFERENCES "User"("Id"),
    FOREIGN KEY ("ProduitId") REFERENCES "Produit"("Id")
);

-- Table PreviousOrder
CREATE TABLE "PreviousOrder" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INT NOT NULL,
    "ProduitId" INT NOT NULL,
    "Quantite" INT NOT NULL,
    "OrderDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("UserId") REFERENCES "User"("Id"),
    FOREIGN KEY ("ProduitId") REFERENCES "Produit"("Id")
);

-- Insertion des données dans la table User
INSERT INTO "User" ("mdp", "nom", "prenom", "adresse", "email") VALUES
('password123', 'Doe', 'John', '123 Main St', 'john.doe@example.com'),
('password456', 'Smith', 'Jane', '456 Elm St', 'jane.smith@example.com'),
('password789', 'Brown', 'Charlie', '789 Oak St', 'charlie.brown@example.com');

-- Insertion des données dans la table Produit
INSERT INTO "Produit" ("Nom", "prix", "description") VALUES
('Produit1', 19.99, 'Description du produit 1'),
('Produit2', 29.99, 'Description du produit 2'),
('Produit3', 39.99, 'Description du produit 3'),
('Produit4', 19.99, 'Description du produit 4'),
('Produit5', 29.99, 'Description du produit 5'),
('Produit6', 39.99, 'Description du produit 6');

-- Insertion des données dans la table Panier
INSERT INTO "Panier" ("UserId", "ProduitId", "Quantite") VALUES
(1, 1, 2),
(2, 2, 1),
(3, 3, 5);

-- Insertion des données dans la table PreviousOrder
INSERT INTO "PreviousOrder" ("UserId", "ProduitId", "Quantite") VALUES
(1, 1, 2),
(2, 2, 1),
(3, 3, 5),
(1, 2, 1),
(2, 3, 2),
(3, 1, 3);

-- Insertion des données dans la table Subscription
INSERT INTO "Subscription" ("ProduitId", "UserId", "StartDate", "EndDate") VALUES
(1, 1, '2023-01-01', '2023-12-31'),
(2, 2, '2023-02-01', '2023-11-30'),
(3, 3, '2023-03-01', '2023-09-30');