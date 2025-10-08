-- Create database
DROP DATABASE IF EXISTS ceb;
CREATE DATABASE IF NOT EXISTS ceb;
USE ceb;

-- staff table
CREATE TABLE staff (
    id VARCHAR(30) PRIMARY KEY, -- Unique staff ID
    username VARCHAR(50) NOT NULL, -- Staff username
    password VARCHAR(50) NOT NULL, -- Staff password
    email VARCHAR(50), -- Staff email
    role VARCHAR(50) -- e.g., 'Admin', 'Site Manager', 'Document Controller Manager'
);

-- project table
CREATE TABLE project (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique project ID
    name VARCHAR(100) NOT NULL, -- Project name
    client VARCHAR(100), -- e.g., 'DCSL', 'CEB'
    location VARCHAR(100), -- e.g., 'Batticaloa Plant'
    status VARCHAR(20), -- e.g., 'Completed', 'In Progress'
    images TEXT, -- Store image paths as a semicolon-separated string
    start_date DATE, -- Project start date
    end_date DATE, -- Project end date
    curr_budget DECIMAL(12,2), -- Current budget
    pre_budget DECIMAL(12,2) -- Initial budget
);

-- project_requests table
CREATE TABLE project_requests (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique request ID
    client VARCHAR(100) NOT NULL, -- Requester's name
    email VARCHAR(100) NOT NULL, -- Requester's email
    location VARCHAR(100), -- Project location
    description TEXT NOT NULL, -- Request description
    request_date DATE -- Request date
);

CREATE TABLE project_budgets (
    bgt_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique budget ID
    proj_id INT, -- Foreign key to project table
    machinery DECIMAL(12,2), -- Cost for machinery
    materials DECIMAL(12,2), -- Cost for materials
    labour_general DECIMAL(12,2), -- Cost for general labour (site cleanup, material transport, etc.)
    labour_skilled DECIMAL(12,2), -- Cost for skilled labour (electricians, plumbers, welders, etc.)
    subcontractors DECIMAL(12,2), -- Cost for subcontractors
    other_costs DECIMAL(12,2), -- Any other costs (maintenance, repairs, scaffolding, etc.)
    total_budget DECIMAL(12,2), -- Total budget
    allocated_date DATE, -- Date when the budget was allocated
    FOREIGN KEY (proj_id) REFERENCES project(id) ON DELETE CASCADE
);

-- staff data
INSERT INTO staff (id, username, password, email, role) VALUES
('CBE04', 'Not_Amaya', '20AMAYA02', 'amaya@gmail.com', 'Project Manager'),
('CBE07', 'SuperPieris', '5up3rp13r15', '2002pieris@gmail.com', 'Site Manager'),
('CBE09', 'xX-Kamal-Xx', '[!!3edcVFR$!^^!]', 'kamalhunterz@gmail.com', 'Site Manager'),
('CBE12', 'AstraAurlia', 'A@_d0nU7_@E', 'doubleAA@gmail.com', 'Document Control Manager'),
('CBE25', 'JSaliya', 'MU113R1YAWA1996', 'jsaliya@gmail.com', 'Admin'),
('sm', 'test', 'test', 'Test@test.com', 'Site Manager'),
('dcm', 'test', 'test', 'Test@test.com', 'Document Control Manager'),
('ad', 'test', 'test', 'Test@test.com', 'Admin');

-- project data
INSERT INTO project (name, client, location, status, images, start_date, end_date, curr_budget, pre_budget) VALUES
('Holiday Bungalow', 'DCSL', 'Batticaloa Plant', 'Completed', '../project_images/Holiday_Bungalow/holiday_bungalow_DCSL_batticalo_plant.png;../project_images/Holiday_Bungalow/holiday_bungalow_DCSL_batticalo_plant (2).png', '2022-01-10', '2022-07-15', 12000000.00, 10500000.00),
('Warehouse', 'DCSL', 'Batticaloa Plant', 'Completed', '../project_images/Warehouse/warehouse_DCSL_batticalo_plant.png;../project_images/Warehouse/warehouse_DCSL_batticalo_plant (2).png;../project_images/Warehouse/warehouse_DCSL_batticalo_plant (3).png', '2021-03-02', '2021-11-18', 37500000.00, 41000000.00),
('Distillery', 'DCSL', 'Batticaloa Plant', 'Completed', '../project_images/DCSL_Distillery/distillery_DCSL_batticalo_plant.png;../project_images/DCSL_Distillery/distillery_DCSL_batticalo_plant (2).png', '2020-06-20', '2021-02-28', 25800000.00, 27200000.00),
('Sub Grid', 'CEB', 'Grid Station, Habarana', 'Completed', '', '2023-02-01', '2023-08-15', 7050000.00, 6800000.00),
('Test', NULL, NULL, 'Ongoing', '', '2024-03-01', NULL, 0.00, 0.00),
('Test 2', NULL, NULL, 'Ongoing', '', '2022-08-10', NULL, 0.00, 0.00),
('Test 3', NULL, NULL, 'Ongoing', '', '2023-05-23', NULL, 35000.00, 30000.00),
('Test 4', NULL, NULL, 'Ongoing', '', '2023-05-24', NULL, 61000.00, 68000.00),
('Test 5', NULL, NULL, 'Ongoing', '', '2023-08-04', NULL, 75000.00, 82000.00);

-- budget data
INSERT INTO project_budgets VALUES
(1, 7, 3500, 1000, 1500, 0, 1000, 800, 7800, '2023-05-23'),
(2, 7, 1200, 1500, 1800, 1000, 0, 600, 6100, '2023-05-24'),
(3, 9, 3200, 1900, 2400, 1000, 1200, 950, 10650, '2023-05-24'),
(4, 7, 1800, 1100, 1300, 600, 800, 700, 6300, '2023-05-25'),
(5, 9, 2100, 2000, 2300, 950, 1150, 900, 9400, '2023-05-25'),
(6, 9, 2800, 2000, 2000, 1100, 1000, 850, 9750, '2023-05-26'),
(7, 7, 1600, 1200, 1400, 500, 700, 600, 6000, '2023-05-26'),
(8, 7, 2000, 1000, 1200, 400, 900, 500, 6000, '2023-05-27'),
(9, 9, 3000, 2200, 2100, 1000, 950, 700, 9950, '2023-05-27'),
(10, 9, 2700, 2400, 1900, 1200, 1050, 800, 10050, '2023-05-28'),
(11, 9, 3400, 2100, 2200, 900, 1100, 850, 10550, '2023-05-29'),
(12, 8, 1700, 1300, 1500, 700, 600, 650, 6450, '2023-08-04'),
(13, 8, 2500, 1900, 1600, 900, 850, 550, 8300, '2023-08-05'),
(14, 8, 2400, 2000, 1700, 800, 900, 500, 8300, '2023-08-06'),
(15, 8, 2600, 1800, 1500, 950, 800, 600, 8250, '2023-08-07');