
-- User Table
CREATE TABLE user (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'mechanic', 'customer') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mechanic Table
CREATE TABLE mechanic (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    employee_id VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    experience INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE mechanic_certification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mechanic_id VARCHAR(50) NOT NULL,
    certification VARCHAR(255) NOT NULL,
    FOREIGN KEY (mechanic_id) REFERENCES mechanic(id) ON DELETE CASCADE
);

CREATE TABLE mechanic_specialization (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mechanic_id VARCHAR(50) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    FOREIGN KEY (mechanic_id) REFERENCES mechanic(id) ON DELETE CASCADE
);

-- Customer Table
CREATE TABLE customer (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    preferred_mechanic VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (preferred_mechanic) REFERENCES mechanic(id) ON DELETE SET NULL
);

-- Vehicle Table
CREATE TABLE vehicle (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    year INT,
    vin VARCHAR(50),
    license_plate VARCHAR(20),
    mileage INT,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

-- Service Table
CREATE TABLE service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration VARCHAR(50)
);

-- Mechanic Appointment Table
CREATE TABLE mechanic_appointment (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL,
    mechanic_id VARCHAR(50),
    date DATE NOT NULL,
    time VARCHAR(20),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE CASCADE,
    FOREIGN KEY (mechanic_id) REFERENCES mechanic(id) ON DELETE SET NULL
);

-- Appointment Services Table (for multiple services per appointment)
CREATE TABLE appointment_service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id VARCHAR(50) NOT NULL,
    service_id INT NOT NULL,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    duration VARCHAR(50),
    selected BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (appointment_id) REFERENCES mechanic_appointment(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE
);

-- Session Table (stores JWT tokens)
CREATE TABLE session (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    jwt_token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    );
    
    
    select * from user;
    select * from session;
    select * from customer;
    select * from mechanic;
    
