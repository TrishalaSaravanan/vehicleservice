-- Insert sample mechanics to test admin stats
-- First, let's add some users with mechanic role
INSERT INTO user (id, email, password_hash, role, is_active, created_at) VALUES
('mech_001', 'sathish@mechniq.com', '$2a$10$example.hash.here', 'mechanic', TRUE, '2024-07-01 10:00:00'),
('mech_002', 'jane.smith@mechniq.com', '$2a$10$example.hash.here', 'mechanic', TRUE, '2024-07-05 11:00:00'),
('mech_003', 'mike.johnson@mechniq.com', '$2a$10$example.hash.here', 'mechanic', TRUE, '2024-07-10 12:00:00'),
('mech_004', 'sarah.wilson@mechniq.com', '$2a$10$example.hash.here', 'mechanic', TRUE, '2024-07-15 13:00:00'),
('mech_005', 'david.brown@mechniq.com', '$2a$10$example.hash.here', 'mechanic', TRUE, '2024-07-20 14:00:00')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Now add the mechanic profiles
INSERT INTO mechanic (id, user_id, employee_id, name, phone, address, experience, is_active, created_at) VALUES
('mech_001', 'mech_001', 'EMP001', 'Sathish Kumar', '+1-555-0101', '123 Main St, City', 5, TRUE, '2024-07-01 10:00:00'),
('mech_002', 'mech_002', 'EMP002', 'Jane Smith', '+1-555-0102', '456 Oak St, City', 3, TRUE, '2024-07-05 11:00:00'),
('mech_003', 'mech_003', 'EMP003', 'Mike Johnson', '+1-555-0103', '789 Pine St, City', 7, TRUE, '2024-07-10 12:00:00'),
('mech_004', 'mech_004', 'EMP004', 'Sarah Wilson', '+1-555-0104', '321 Elm St, City', 4, TRUE, '2024-07-15 13:00:00'),
('mech_005', 'mech_005', 'EMP005', 'David Brown', '+1-555-0105', '654 Maple St, City', 6, TRUE, '2024-07-20 14:00:00')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Add some sample customers for appointments (if not exists)
INSERT INTO user (id, email, password_hash, role, is_active, created_at) VALUES
('cust_001', 'kumar@example.com', '$2a$10$example.hash.here', 'customer', TRUE, '2024-07-01 09:00:00'),
('cust_002', 'naveen@example.com', '$2a$10$example.hash.here', 'customer', TRUE, '2024-07-02 09:00:00')
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO customer (id, user_id, name, phone, address, is_active, created_at) VALUES
('cust_001', 'cust_001', 'Kumar', '+1-555-0201', '111 Customer St, City', TRUE, '2024-07-01 09:00:00'),
('cust_002', 'cust_002', 'Naveen', '+1-555-0202', '222 Customer Ave, City', TRUE, '2024-07-02 09:00:00')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Add some sample vehicles
INSERT INTO vehicle (id, customer_id, make, model, year, vin, license_plate, mileage) VALUES
('veh_001', 'cust_001', 'Toyota', 'Camry', 2020, 'JT2BF22K3W0123456', 'ABC123', 45000),
('veh_002', 'cust_002', 'Ford', 'F-150', 2021, '1FTFW1E5XMK123456', 'XYZ789', 32000)
ON DUPLICATE KEY UPDATE make = VALUES(make);

-- Add some sample appointments for today and yesterday to test trends
INSERT INTO mechanic_appointment (id, vehicle_id, mechanic_id, date, time, notes, status, created_at) VALUES
-- Today's appointments (for Today Schedules)
('appt_001', 'veh_001', 'mech_001', CURDATE(), '09:00', 'Brake inspection', 'Scheduled', NOW()),
('appt_002', 'veh_002', 'mech_002', CURDATE(), '11:00', 'Oil change', 'Scheduled', NOW()),
('appt_003', 'veh_001', 'mech_003', CURDATE(), '14:00', 'Tire rotation', 'Scheduled', NOW()),

-- Yesterday's appointments (for trend calculation)
('appt_004', 'veh_002', 'mech_001', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '10:00', 'Engine check', 'Completed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('appt_005', 'veh_001', 'mech_002', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '15:00', 'AC service', 'Completed', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE notes = VALUES(notes);

-- Verify the data was inserted
SELECT 'Total mechanics in database:' as description, COUNT(*) as count FROM mechanic WHERE is_active = TRUE;
SELECT 'Today appointments:' as description, COUNT(*) as count FROM mechanic_appointment WHERE DATE(date) = CURDATE();
SELECT 'Today new bookings:' as description, COUNT(*) as count FROM mechanic_appointment WHERE DATE(created_at) = CURDATE();
SELECT 'Yesterday appointments:' as description, COUNT(*) as count FROM mechanic_appointment WHERE DATE(date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY);

-- Show the mechanics we just added
SELECT 'Mechanics in system:' as description, name, employee_id, experience FROM mechanic WHERE is_active = TRUE;
