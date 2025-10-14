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
('CBE07', 'SuperPieris', '5up3rp13r15', '2002pieris@yahoo.com', 'Site Manager'),
('CBE09', 'xX-Kamal-Xx', '[!!3edcVFR$!^^!]', 'kamalhunterz@gmail.com', 'Site Manager'),
('CBE12', 'AstraAurlia', 'A@_d0nU7_@E', 'doubleAA@gmail.com', 'Document Control Manager'),
('CBE25', 'JSaliya', 'MU113R1YAWA1996', 'jsaliya@gmail.com', 'Admin'),
('sm', 'test', 'test', 'Test@test.com', 'Site Manager'),
('dcm', 'test', 'test', 'Test@test.com', 'Document Control Manager'),
('ad', 'test', 'test', 'Test@test.com', 'Admin');

INSERT INTO project_requests VALUES
(1, 'Aditya Pancho', 'paditya_home@gmail.com', '31/2, Bambalapitiya, Colombo',
'Swimming pool for a house. The pool should be freeform, around 1.6m deep throughout, and at least 500 sq ft. The surfaces should be smooth. There are stairs with rails',
'2024-03-14'),
(2, 'Ruwan John Perera', 'rj45perera@example.com', '45/7, Galle Road, Mount Lavinia', 
 'Renovation of a two-story house including roof replacement, new electrical wiring, and modern bathroom fittings. Expected completion within 6 months.', 
 '2024-04-02'),
(3, 'Melissa Fernando', 'dilani.fernando@outlook.com', 'No. 12, Lake Road, Kandy', 
 'Construction of a boutique hotel with 12 rooms, a rooftop restaurant, and solar-powered hot water system. Eco-friendly design preferred.', 
 '2024-04-10'),
(4, 'Sajith De Silva', 'sajith.desilva@gmail.com', 'Industrial Zone, Katunayake', 
 'Request for a new warehouse facility with 10,000 sq ft storage, loading bays, and automated fire safety systems. Must comply with BOI regulations.', 
 '2024-04-18');


-- project data
INSERT INTO project (name, client, location, status, images, start_date, end_date, curr_budget, pre_budget) VALUES
('Holiday Bungalow', 'DCSL', 'Batticaloa Plant', 'Completed', '../project_images/Holiday_Bungalow/holiday_bungalow_DCSL_batticalo_plant.png;../project_images/Holiday_Bungalow/holiday_bungalow_DCSL_batticalo_plant (2).png', '2021-05-10', '2022-07-15', 32000000.00, 30500000.00),
('Warehouse', 'DCSL', 'Batticaloa Plant', 'Completed', '../project_images/Warehouse/warehouse_DCSL_batticalo_plant.png;../project_images/Warehouse/warehouse_DCSL_batticalo_plant (2).png;../project_images/Warehouse/warehouse_DCSL_batticalo_plant (3).png', '2020-03-02', '2021-11-18', 67000000.00, 1000000.00),
('Distillery', 'DCSL', 'Batticaloa Plant', 'Completed', '../project_images/DCSL_Distillery/distillery_DCSL_batticalo_plant.png;../project_images/DCSL_Distillery/distillery_DCSL_batticalo_plant (2).png', '2020-04-20', '2021-02-28', 45800000.00, 47200000.00),
('Sub Grid', 'CEB', 'Grid Station, Habarana', 'Completed', NULL, '2023-02-01', '2023-08-15', 4400000.00, 3800000.00),
('Water Facility', 'Formula World', 'Negombo Road, Seeduwa', 'Completed', NULL, '2021-09-15', '2022-05-29', 4000000.00, 4000000.00),
('Test', NULL, NULL, 'Ongoing', '', '2024-03-01', NULL, 0.00, 0.00),
('Test 2', NULL, NULL, 'Ongoing', '', '2022-08-10', NULL, 0.00, 0.00),
('Test 3', NULL, NULL, 'Ongoing', '', '2023-05-23', NULL, 385000.00, 330000.00),
('Test 4', NULL, NULL, 'Ongoing', '', '2023-05-24', NULL, 720000.00, 600000.00),
('Test 5', NULL, NULL, 'Ongoing', '', '2023-08-04', NULL, 550000.00, 500000.00),
('Colombo Office Complex', 'John Keells Holdings', 'Colombo 02', 'Ongoing', '', '2024-01-15', NULL, 155000000.00, 140000000.00),
('Southern Highway Extension', 'RDA', 'Matara', 'Ongoing', '', '2023-11-01', NULL, 98000000.00, 95000000.00),
('Hydropower Plant Upgrade', 'CEB', 'Nuwara Eliya', 'Ongoing', '', '2024-02-10', NULL, 52000000.00, 50000000.00),
('Luxury Apartment Tower', 'Prime Residencies', 'Kandy', 'Ongoing', '', '2023-09-05', NULL, 210000000.00, 210000000.00),
('Port Expansion', 'SLPA', 'Hambantota', 'Ongoing', '', '2024-03-20', NULL, 125000000.00, 120000000.00);

-- budget data
INSERT INTO project_budgets VALUES
(1, 8, 35000, 15000, 15000, 0, 10000, 8000, 83000, '2023-05-23'),
(2, 8, 12000, 15000, 18000, 10000, 0, 6000, 61000, '2023-05-24'),
(3, 10, 32000, 19000, 24000, 10000, 12000, 9500, 106500, '2023-05-24'),
(4, 8, 18000, 11000, 13000, 6000, 8000, 7000, 63000, '2023-05-25'),
(5, 10, 21000, 20000, 23500, 9500, 11500, 9500, 95000, '2023-05-25'),
(6, 10, 28000, 20000, 20000, 11000, 10000, 8500, 97500, '2023-05-26'),
(7, 8, 16000, 12000, 14000, 5000, 7000, 6000, 60000, '2023-05-26'),
(8, 8, 23000, 11000, 12000, 4000, 9000, 5000, 64000, '2023-05-27'),
(9, 10, 30000, 22000, 21000, 10000, 9500, 7000, 99500, '2023-05-27'),
(10, 10, 27000, 24000, 19000, 12000, 10500, 8000, 100500, '2023-05-28'),
(11, 10, 34000, 21000, 22000, 9000, 11000, 8500, 105500, '2023-05-29'),
(12, 9, 17000, 13000, 15000, 7000, 6000, 6500, 64500, '2023-08-04'),
(13, 9, 25000, 19000, 16000, 9000, 8500, 5500, 83000, '2023-08-05'),
(14, 9, 24000, 20000, 17000, 8000, 9000, 5000, 83000, '2023-08-06'),
(15, 9, 26000, 18000, 15000, 9500, 8000, 6000, 82500, '2023-08-07'),
(16, 11, 10000, 16000, 6000, 8000, 4000, 3000, 47000, '2024-01-15'),
(17, 11, 10400, 15600, 6200, 8400, 4200, 3200, 48000, '2024-01-16'),
(18, 11, 9600, 16400, 5800, 8200, 4400, 2800, 47200, '2024-01-18'),
(19, 11, 10200, 15800, 6100, 8600, 4000, 3000, 47700, '2024-01-19'),
(20, 11, 10600, 16200, 6400, 8800, 4600, 3400, 50000, '2024-01-20'),
(21, 11, 10800, 16400, 6600, 9000, 4800, 3600, 51200, '2024-01-21'),
(22, 11, 11000, 16600, 6800, 9200, 5000, 3800, 52400, '2024-01-22'),
(23, 11, 11200, 16800, 7000, 9400, 5200, 4000, 53600, '2024-01-23'),
(24, 11, 11400, 17000, 7200, 9600, 5400, 4200, 54800, '2024-01-24'),
(25, 11, 11600, 17200, 7400, 9800, 5600, 4400, 56000, '2024-01-25'),
(26, 12, 14000, 24000, 10000, 12000, 8000, 5000, 73000, '2023-11-01'),
(27, 12, 13600, 23600, 9600, 11800, 7800, 4800, 71200, '2023-11-02'),
(28, 12, 14400, 24200, 10200, 12200, 8200, 5200, 74400, '2023-11-04'),
(29, 12, 14200, 23800, 9900, 12100, 8100, 5100, 73100, '2023-11-05'),
(30, 12, 14600, 24400, 10400, 12400, 8400, 5400, 75200, '2023-11-06'),
(31, 12, 13800, 23400, 9700, 11900, 7900, 4900, 71600, '2023-11-07'),
(32, 12, 14800, 24600, 10600, 12600, 8600, 5600, 76800, '2023-11-08'),
(33, 12, 15000, 24800, 10800, 12800, 8800, 5800, 78000, '2023-11-09'),
(34, 12, 15200, 25000, 11000, 13000, 9000, 6000, 79200, '2023-11-10'),
(35, 12, 15400, 25200, 11200, 13200, 9200, 6200, 80400, '2023-11-11'),
(36, 13, 12000, 19000, 8000, 10000, 6000, 4000, 59000, '2024-02-10'),
(37, 13, 12400, 19400, 8200, 10200, 6200, 4200, 60600, '2024-02-11'),
(38, 13, 12200, 19200, 8100, 10100, 6100, 4100, 59800, '2024-02-12'),
(39, 13, 12600, 19600, 8400, 10400, 6400, 4400, 61800, '2024-02-13'),
(40, 13, 12800, 19800, 8600, 10600, 6600, 4600, 63000, '2024-02-15'),
(41, 13, 13000, 20000, 8800, 10800, 6800, 4800, 64000, '2024-02-16'),
(42, 13, 13200, 20200, 9000, 11000, 7000, 5000, 65400, '2024-02-17'),
(43, 13, 13400, 20400, 9200, 11200, 7200, 5200, 66600, '2024-02-18'),
(44, 13, 13600, 20600, 9400, 11400, 7400, 5400, 67800, '2024-02-19'),
(45, 13, 13800, 20800, 9600, 11600, 7600, 5600, 69000, '2024-02-20'),
(46, 14, 20000, 30000, 14000, 16000, 12000, 7000, 99000, '2023-09-05'),
(47, 14, 20400, 30400, 14200, 16200, 12200, 7200, 100600, '2023-09-06'),
(48, 14, 19600, 29600, 13800, 15800, 11800, 6800, 97400, '2023-09-07'),
(49, 14, 20200, 30200, 14100, 16100, 12100, 7100, 99800, '2023-09-08'),
(50, 14, 20600, 30600, 14400, 16400, 12400, 7400, 101800, '2023-09-09'),
(51, 14, 19800, 29800, 13900, 15900, 11900, 6900, 98200, '2023-09-11'),
(52, 14, 20800, 30800, 14600, 16600, 12600, 7600, 103000, '2023-09-12'),
(53, 14, 21000, 31000, 14800, 16800, 12800, 7800, 104000, '2023-09-13'),
(54, 14, 21200, 31200, 15000, 17000, 13000, 8000, 105200, '2023-09-14'),
(55, 14, 21400, 31400, 15200, 17200, 13200, 8200, 106400, '2023-09-15'),
(56, 15, 16000, 26000, 12000, 14000, 10000, 6000, 83600, '2024-03-20'),
(57, 15, 16400, 26400, 12200, 14200, 10200, 6200, 85400, '2024-03-21'),
(58, 15, 15800, 25800, 11800, 13800, 9800, 5800, 80600, '2024-03-22'),
(59, 15, 16200, 26200, 12100, 14100, 10100, 6100, 84600, '2024-03-23');