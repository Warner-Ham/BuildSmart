-- Create database
DROP DATABASE IF EXISTS ceb;
CREATE DATABASE IF NOT EXISTS ceb;
USE ceb;

-- Staff table
CREATE TABLE Staff (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    name VARCHAR(100),
    role VARCHAR(50)
);

-- Projects table
CREATE TABLE Projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    client VARCHAR(100),
    location VARCHAR(200),
    status VARCHAR(50),
    images TEXT
);

-- Staff data
INSERT INTO Staff (id, username, password) VALUES
('CBE01', 'Not_Amaya', '20AMAYA02'),
('CBE03', 'SuperPieris', '5up3rp13r15'),
('CBE06', 'xX-Kamal-Xx', '[3edcVFR$]'),
('CBEAD', 'JSaliya', 'MU113R1YAWA1996');

-- Projects data
INSERT INTO Projects (id, name, client, location, status, images) VALUES
(0, 'Holiday Bungalow', 'DCSL', 'Batticaloa Plant', 'Completed',
  '../project_images/Holiday_Bungalow/holiday_bungalow_DCSL_batticalo_plant.png;../project_images/Holiday_Bungalow/holiday_bungalow_DCSL_batticalo_plant (2).png'),
(1, 'Warehouse', 'DCSL', 'Batticaloa Plant', 'Completed',
  '../project_images/Warehouse/warehouse_DCSL_batticalo_plant.png;../project_images/Warehouse/warehouse_DCSL_batticalo_plant (2).png;../project_images/Warehouse/warehouse_DCSL_batticalo_plant (3).png;../project_images/Warehouse/warehouse_DCSL_batticalo_plant (4).png'),
(2, 'Sub Grid', 'CEB', 'Grid Station, Habarana', 'Completed', '');