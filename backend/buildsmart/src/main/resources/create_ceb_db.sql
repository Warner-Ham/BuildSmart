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
    images TEXT,
    pre_budget DECIMAL(15,2),
    curr_budget DECIMAL(15,2),
    start_date DATE,
    end_date DATE
);

-- Project Requests table
CREATE TABLE project_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    request_date DATE NOT NULL,
    deleted BOOLEAN DEFAULT FALSE
);

-- Staff data
INSERT INTO Staff (id, username, password) VALUES
('CBE01', 'Not_Amaya', '20AMAYA02'),
('CBE03', 'SuperPieris', '5up3rp13r15'),
('CBE06', 'xX-Kamal-Xx', '[3edcVFR$]'),
('CBEAD', 'JSaliya', 'MU113R1YAWA1996');

-- Projects data
INSERT INTO Projects (id, name, client, location, status, images, pre_budget, curr_budget, start_date, end_date) VALUES
(0, 'Holiday Bungalow', 'DCSL', 'Batticaloa Plant', 'Completed',
  '../project_images/Holiday_Bungalow/holiday_bungalow_DCSL_batticalo_plant.png;../project_images/Holiday_Bungalow/holiday_bungalow_DCSL_batticalo_plant (2).png',
  2500000.00, 2750000.00, '2023-01-15', '2023-06-30'),
(1, 'Warehouse', 'DCSL', 'Batticaloa Plant', 'Completed',
  '../project_images/Warehouse/warehouse_DCSL_batticalo_plant.png;../project_images/Warehouse/warehouse_DCSL_batticalo_plant (2).png;../project_images/Warehouse/warehouse_DCSL_batticalo_plant (3).png;../project_images/Warehouse/warehouse_DCSL_batticalo_plant (4).png',
  1800000.00, 1950000.00, '2023-03-01', '2023-08-15'),
(2, 'Sub Grid', 'CEB', 'Grid Station, Habarana', 'Completed', '',
  3200000.00, 3100000.00, '2023-02-10', '2023-07-20'),
(3, 'Office Complex', 'ABC Corporation', 'Colombo 03', 'In Progress', '',
  5000000.00, 5200000.00, '2024-01-01', '2024-12-31'),
(4, 'Residential Building', 'XYZ Developers', 'Kandy', 'Planning', '',
  7500000.00, 7500000.00, '2024-06-01', '2025-06-01');