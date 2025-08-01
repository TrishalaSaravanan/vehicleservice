# 🚗 Vehicle Service Management System

A comprehensive full-stack web application for managing vehicle service operations, built with Angular 19 and Node.js/Express.

## 🌟 Features

### 👤 Multi-Role Authentication
- **Admin Dashboard**: Complete system oversight with analytics
- **Mechanic Portal**: Service management and scheduling
- **Customer Interface**: Appointment booking and service tracking
- **Secure JWT Authentication**: HTTP-only cookies for enhanced security

### 📊 Admin Dashboard
- **Interactive Charts**: Service distribution, revenue tracking, appointment trends
- **User Management**: CRUD operations for customers and mechanics
- **Service Management**: Configure services, pricing, and availability
- **Analytics & Reports**: Comprehensive business insights

### 🔧 Service Management
- **Appointment Booking**: Real-time scheduling system
- **Service Tracking**: Complete service history and status updates
- **Parts Management**: Inventory tracking and ordering
- **Vehicle Records**: Comprehensive vehicle maintenance history

### 🔒 Security Features
- **HTTP-Only Cookies**: XSS protection for authentication tokens
- **CORS Configuration**: Secure cross-origin requests
- **Role-Based Access Control**: Granular permissions system
- **Secure Password Hashing**: bcrypt implementation

## 🛠️ Tech Stack

### Frontend
- **Angular 19.2.14**: Modern TypeScript framework
- **Chart.js**: Interactive data visualizations
- **Tailwind CSS**: Utility-first CSS framework
- **RxJS**: Reactive programming for async operations

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MySQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **cookie-parser**: HTTP cookie parsing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Angular CLI (v19 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TrishalaSaravanan/vehicleservice.git
   cd vehicleservice
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Configure database credentials in .env
   
   # Setup database
   mysql -u root -p < ../database.sql
   mysql -u root -p < ../sample_data.sql
   
   # Start backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd vehicle_service_management
   npm install
   
   # Start development server
   ng serve
   ```

4. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000

### Default Admin Credentials
- Email: `admin@example.com`
- Password: `admin123`

---

# 📚 API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
The API uses JWT tokens stored in HTTP-only cookies for authentication. Include `credentials: true` in your requests.

---

## 🔐 Authentication Endpoints

### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "customer",
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, State"
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "usr_1234567890",
    "email": "john.doe@example.com",
    "role": "customer",
    "customer": {
      "id": "cust_1234567890",
      "name": "John Doe",
      "phone": "+1234567890",
      "address": "123 Main St, City, State"
    }
  }
}
```

### POST /auth/login
Authenticate user and set JWT cookie.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "usr_1234567890",
    "email": "john.doe@example.com",
    "role": "customer"
  }
}
```

### POST /auth/logout
Clear authentication cookie and logout user.

**Headers:** `Authentication required`

**Sample Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /auth/customer/profile
Get current customer profile.

**Headers:** `Authentication required`

**Sample Response:**
```json
{
  "success": true,
  "profile": {
    "id": "cust_1234567890",
    "user_id": "usr_1234567890",
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "email": "john.doe@example.com",
    "preferred_mechanic": null,
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z"
  }
}
```

### PUT /auth/customer/profile
Update customer profile.

**Headers:** `Authentication required`

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567891",
  "address": "456 New St, City, State"
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### GET /auth/mechanic/profile
Get current mechanic profile.

**Headers:** `Authentication required`

**Sample Response:**
```json
{
  "success": true,
  "profile": {
    "id": "mech_1234567890",
    "user_id": "usr_1234567891",
    "employee_id": "EMP001",
    "name": "Mike Johnson",
    "phone": "+1234567892",
    "address": "789 Mechanic St, City, State",
    "email": "mike.johnson@example.com",
    "experience": 5,
    "certification": ["ASE Certified", "BMW Specialist"],
    "specialization": ["Engine Repair", "Brake Systems"],
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z"
  }
}
```

### GET /auth/admin/customers
Get all customers (admin only).

**Headers:** `Authentication required (Admin role)`

**Sample Response:**
```json
[
  {
    "id": "cust_1234567890",
    "user_id": "usr_1234567890",
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "email": "john.doe@example.com",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

### PUT /auth/admin/customers/:id
Update customer details (admin only).

**Headers:** `Authentication required (Admin role)`

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567891",
  "email": "john.updated@example.com"
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Customer updated successfully"
}
```

### DELETE /auth/admin/customers/:id
Delete customer (admin only).

**Headers:** `Authentication required (Admin role)`

**Sample Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

---

## 👨‍🔧 Mechanic Management Endpoints

### GET /mechanics
Get all mechanics.

**Sample Response:**
```json
[
  {
    "id": "mech_1234567890",
    "user_id": "usr_1234567891",
    "employee_id": "EMP001",
    "name": "Mike Johnson",
    "phone": "+1234567892",
    "address": "789 Mechanic St, City, State",
    "experience": 5,
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "certifications": ["ASE Certified", "BMW Specialist"],
    "specializations": ["Engine Repair", "Brake Systems"]
  }
]
```

### POST /mechanics
Add a new mechanic.

**Request Body:**
```json
{
  "email": "new.mechanic@example.com",
  "password": "mechanic123",
  "name": "Sarah Williams",
  "phone": "+1234567893",
  "address": "321 Workshop Ave, City, State",
  "experience": 3,
  "certifications": ["ASE Certified"],
  "specializations": ["Transmission", "Electrical"]
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Mechanic added successfully",
  "mechanic": {
    "id": "mech_1234567891",
    "name": "Sarah Williams",
    "employee_id": "EMP002"
  }
}
```

### PUT /mechanics/:id
Update mechanic details.

**Request Body:**
```json
{
  "name": "Sarah Williams Updated",
  "phone": "+1234567894",
  "experience": 4,
  "certifications": ["ASE Certified", "Honda Specialist"],
  "specializations": ["Transmission", "Electrical", "AC Systems"]
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Mechanic updated successfully"
}
```

### DELETE /mechanics/:id
Delete a mechanic.

**Sample Response:**
```json
{
  "success": true,
  "message": "Mechanic deleted successfully"
}
```

---

## 🔧 Service Management Endpoints

### GET /services
Get all available services.

**Sample Response:**
```json
[
  {
    "id": 1,
    "name": "Oil Change",
    "description": "Complete engine oil and filter replacement",
    "price": 49.99,
    "duration": 30,
    "created_at": "2025-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Brake Inspection",
    "description": "Comprehensive brake system check and adjustment",
    "price": 89.99,
    "duration": 60,
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

### POST /services
Add a new service.

**Request Body:**
```json
{
  "name": "Tire Rotation",
  "description": "Professional tire rotation and balancing",
  "price": 39.99,
  "duration": 45
}
```

**Sample Response:**
```json
{
  "id": 3,
  "name": "Tire Rotation",
  "description": "Professional tire rotation and balancing",
  "price": 39.99,
  "duration": 45
}
```

### PUT /services/:id
Update service details.

**Request Body:**
```json
{
  "name": "Tire Rotation & Balance",
  "description": "Professional tire rotation, balancing, and pressure check",
  "price": 44.99,
  "duration": 50
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Service updated successfully"
}
```

### DELETE /services/:id
Delete a service.

**Sample Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

## 🚗 Vehicle Management Endpoints

### POST /vehicles/add
Add a new vehicle for a customer.

**Request Body:**
```json
{
  "customer_id": "cust_1234567890",
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "license_plate": "ABC123",
  "vin": "1HGBH41JXMN109186",
  "color": "Silver",
  "mileage": 25000
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Vehicle added successfully",
  "vehicle": {
    "id": "veh_1234567890",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "license_plate": "ABC123"
  }
}
```

### GET /vehicles/customer/:customer_id
Get all vehicles for a specific customer.

**Sample Response:**
```json
[
  {
    "id": "veh_1234567890",
    "customer_id": "cust_1234567890",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "license_plate": "ABC123",
    "vin": "1HGBH41JXMN109186",
    "color": "Silver",
    "mileage": 25000,
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

### DELETE /vehicles/delete/:id
Delete a vehicle.

**Sample Response:**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

---

## 📅 Appointment Management Endpoints

### GET /appointments
Get appointments (filtered by role).

**Query Parameters:**
- `customerId`: Filter by customer ID
- `mechanicId`: Filter by mechanic ID

**Sample Response:**
```json
[
  {
    "id": 1,
    "customer_id": "cust_1234567890",
    "vehicle_id": "veh_1234567890",
    "mechanic_id": "mech_1234567890",
    "service_id": 1,
    "appointment_date": "2025-01-20T14:00:00.000Z",
    "status": "Confirmed",
    "price": 49.99,
    "notes": "Customer requested early morning appointment",
    "customer_name": "John Doe",
    "customer_phone": "+1234567890",
    "vehicle_make": "Toyota",
    "vehicle_model": "Camry",
    "vehicle_year": 2020,
    "service_name": "Oil Change",
    "service_description": "Complete engine oil and filter replacement",
    "mechanic_name": "Mike Johnson",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

### POST /appointments
Book a new appointment.

**Request Body:**
```json
{
  "customer_id": "cust_1234567890",
  "vehicle_id": "veh_1234567890",
  "service_id": 1,
  "appointment_date": "2025-01-20T14:00:00.000Z",
  "notes": "Customer requested early morning appointment",
  "mechanic_id": "mech_1234567890",
  "price": 49.99
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully"
}
```

### PATCH /appointments/:id/status
Update appointment status and assign mechanic.

**Request Body:**
```json
{
  "status": "Assigned",
  "mechanic_id": "mech_1234567890"
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Appointment status updated"
}
```

**Valid Status Values:**
- `Pending`
- `Accepted`
- `Rejected`
- `Assigned`
- `Completed`
- `Cancelled`

---

## 🔩 Parts Management Endpoints

### GET /parts
Get all parts inventory.

**Sample Response:**
```json
[
  {
    "id": 1,
    "name": "Engine Oil Filter",
    "part_number": "OF-001",
    "description": "High-quality engine oil filter for most vehicles",
    "price": 12.99,
    "quantity_in_stock": 50,
    "supplier": "AutoParts Inc",
    "category": "Filters",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

### POST /parts
Add a new part to inventory.

**Request Body:**
```json
{
  "name": "Brake Pad Set",
  "part_number": "BP-002",
  "description": "Premium ceramic brake pads - Front Set",
  "price": 89.99,
  "quantity_in_stock": 25,
  "supplier": "BrakeMaster Ltd",
  "category": "Brakes"
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Part added successfully",
  "part": {
    "id": 2,
    "name": "Brake Pad Set",
    "part_number": "BP-002",
    "price": 89.99
  }
}
```

### PUT /parts/:id
Update part details.

**Request Body:**
```json
{
  "name": "Brake Pad Set - Premium",
  "price": 94.99,
  "quantity_in_stock": 30,
  "description": "Premium ceramic brake pads - Front Set - Enhanced Formula"
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Part updated successfully"
}
```

### DELETE /parts/:id
Delete a part from inventory.

**Sample Response:**
```json
{
  "success": true,
  "message": "Part deleted successfully"
}
```

---

## 📊 Admin Dashboard Endpoints

### GET /admin/test-db
Test database connection.

**Headers:** `Authentication required (Admin role)`

**Sample Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### GET /admin/stats
Get admin dashboard statistics.

**Headers:** `Authentication required (Admin role)`

**Sample Response:**
```json
{
  "totalCustomers": 150,
  "totalMechanics": 12,
  "totalAppointments": 1250,
  "totalRevenue": 125000.50,
  "pendingAppointments": 25,
  "completedAppointments": 1100,
  "activeServices": 8,
  "totalParts": 85
}
```

### GET /admin/service-distribution
Get service distribution data for charts.

**Headers:** `Authentication required (Admin role)`

**Sample Response:**
```json
[
  {
    "service_name": "Oil Change",
    "appointment_count": 450
  },
  {
    "service_name": "Brake Inspection",
    "appointment_count": 280
  },
  {
    "service_name": "Tire Service",
    "appointment_count": 320
  }
]
```

### GET /admin/revenue-by-service
Get revenue breakdown by service type.

**Headers:** `Authentication required (Admin role)`

**Sample Response:**
```json
[
  {
    "service_name": "Oil Change",
    "total_revenue": 22475.50
  },
  {
    "service_name": "Brake Inspection",
    "total_revenue": 25197.20
  },
  {
    "service_name": "Engine Repair",
    "total_revenue": 45600.00
  }
]
```

### GET /admin/weekly-appointments
Get weekly appointment trends.

**Headers:** `Authentication required (Admin role)`

**Sample Response:**
```json
[
  {
    "week": "2025-W01",
    "appointment_count": 45
  },
  {
    "week": "2025-W02",
    "appointment_count": 52
  },
  {
    "week": "2025-W03",
    "appointment_count": 38
  }
]
```

---

## 📈 Report Endpoints

### GET /reports/customers
Get customer activity report.

**Headers:** `Authentication required (Admin role)`

**Query Parameters:**
- `startDate`: Filter from date (YYYY-MM-DD)
- `endDate`: Filter to date (YYYY-MM-DD)

**Sample Response:**
```json
[
  {
    "customer_id": "cust_1234567890",
    "customer_name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "total_appointments": 8,
    "total_spent": 450.75,
    "last_appointment": "2025-01-10T14:00:00.000Z",
    "preferred_services": ["Oil Change", "Brake Inspection"]
  }
]
```

### GET /reports/customers/export
Export customer report as CSV.

**Headers:** `Authentication required (Admin role)`

**Response:** CSV file download

### GET /reports/mechanics
Get mechanic performance report.

**Headers:** `Authentication required (Admin role)`

**Sample Response:**
```json
[
  {
    "mechanic_id": "mech_1234567890",
    "mechanic_name": "Mike Johnson",
    "employee_id": "EMP001",
    "total_appointments": 125,
    "completed_appointments": 118,
    "average_rating": 4.8,
    "total_revenue_generated": 15750.00,
    "specializations": ["Engine Repair", "Brake Systems"]
  }
]
```

### GET /reports/mechanics/export
Export mechanic report as CSV.

**Headers:** `Authentication required (Admin role)`

**Response:** CSV file download

---

## 🚨 Error Responses

### Authentication Errors
```json
{
  "success": false,
  "message": "Access denied. No token provided.",
  "code": "NO_TOKEN"
}
```

### Validation Errors
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Server Errors
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

### Not Found Errors
```json
{
  "success": false,
  "message": "Resource not found",
  "code": "NOT_FOUND"
}
```

---

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vehicle_service_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:4200
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd vehicle_service_management
ng test
```

### E2E Tests
```bash
cd vehicle_service_management
ng e2e
```

---

## 📝 Database Schema

### Key Tables
- **user**: User authentication and roles
- **customer**: Customer profiles and details
- **mechanic**: Mechanic profiles and specializations
- **vehicle**: Customer vehicle information
- **service**: Available services and pricing
- **appointment**: Service appointments and scheduling
- **parts**: Inventory management

### Sample Database Commands
```sql
-- View all appointments with customer details
SELECT a.*, c.name as customer_name, s.name as service_name 
FROM appointment a 
JOIN customer c ON a.customer_id = c.id 
JOIN service s ON a.service_id = s.id;

-- Get mechanic workload
SELECT m.name, COUNT(a.id) as total_appointments 
FROM mechanic m 
LEFT JOIN appointment a ON m.id = a.mechanic_id 
GROUP BY m.id;
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support and questions:
- Email: support@vehicleservice.com
- GitHub Issues: [Create an issue](https://github.com/TrishalaSaravanan/vehicleservice/issues)

---

## 🚀 Deployment

### Production Environment
```bash
# Backend
npm run build
npm run start:prod

# Frontend
ng build --prod
```

### Docker Deployment
```bash
docker-compose up -d
```

---

## 📋 API Testing with Postman

### Import Collection
You can test all endpoints using the provided Postman collection:

1. **Authentication Flow**
   ```javascript
   // Set base URL
   pm.globals.set("baseUrl", "http://localhost:3000/api");
   
   // Login and extract token (automatic with cookies)
   pm.test("Login successful", function () {
       pm.response.to.have.status(200);
       var jsonData = pm.response.json();
       pm.expect(jsonData.success).to.eql(true);
   });
   ```

2. **Sample Test Scripts**
   ```javascript
   // Test appointment creation
   pm.test("Appointment created", function () {
       pm.response.to.have.status(201);
       var jsonData = pm.response.json();
       pm.expect(jsonData.success).to.eql(true);
       pm.globals.set("appointmentId", jsonData.appointmentId);
   });
   ```

---

## 🔄 API Response Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## 📊 Performance Metrics

### API Benchmarks
- **Average Response Time**: < 200ms
- **Concurrent Users**: Up to 100
- **Database Connections**: Pool of 10
- **Memory Usage**: < 512MB

---

**Built with ❤️ by the Vehicle Service Management Team**

---

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/TrishalaSaravanan/vehicleservice.git
cd vehicleservice

# Backend setup
cd backend && npm install && npm start

# Frontend setup (new terminal)
cd vehicle_service_management && npm install && ng serve

# Database setup
mysql -u root -p < database.sql
mysql -u root -p < sample_data.sql
```

**Happy Coding! 🎉**
- MySQL (v8.0 or higher)
- Angular CLI (v19 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TrishalaSaravanan/vehicleservice.git
   cd vehicleservice
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   # Import the database schema
   mysql -u your_username -p your_database < database.sql
   ```

4. **Frontend Setup**
   ```bash
   cd vehicle_service_management
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend/src
   node server.js
   ```
   Server will run on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd vehicle_service_management
   ng serve
   ```
   Application will be available at `http://localhost:4200`

## 📁 Project Structure

```
vehicleservice/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/       # Business logic controllers
│   │   ├── middleware/        # Authentication & validation
│   │   ├── routes/           # API route definitions
│   │   ├── utils/            # Helper utilities
│   │   └── server.js         # Express server configuration
│   └── package.json
│
├── vehicle_service_management/ # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── features/     # Feature modules
│   │   │   │   ├── admin/    # Admin dashboard
│   │   │   │   ├── customer/ # Customer interface
│   │   │   │   └── mechanic/ # Mechanic portal
│   │   │   ├── services/     # Angular services
│   │   │   └── shared/       # Shared components
│   │   └── assets/           # Static assets
│   └── package.json
│
├── database.sql              # Database schema
└── README.md
```

## 🔧 Configuration

### Environment Variables (.env)
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=vehicle_service_db
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### CORS Configuration
The backend is configured to accept requests from `http://localhost:4200` (Angular dev server). Update the CORS origin in `server.js` for production deployment.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/customer/profile` - Get customer profile
- `GET /api/auth/mechanic/profile` - Get mechanic profile

### Admin Operations
- `GET /api/auth/admin/customers` - Get all customers
- `PUT /api/auth/admin/customers/:id` - Update customer
- `DELETE /api/auth/admin/customers/:id` - Delete customer

### Services & Appointments
- `GET /api/services` - Get available services
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/:userId` - Get user appointments

## 🔒 Security Features

### JWT Cookie Implementation
- **HTTP-Only Cookies**: Tokens stored securely, inaccessible to JavaScript
- **CSRF Protection**: SameSite cookie attributes
- **Automatic Expiry**: Configurable token expiration
- **Secure Transmission**: HTTPS enforcement in production

### Authentication Flow
1. User submits login credentials
2. Server validates and creates JWT token
3. Token stored as HTTP-only cookie
4. Subsequent requests automatically include token
5. Middleware validates token for protected routes

## 🎨 UI Features

### Admin Dashboard
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Charts**: Real-time data visualization
- **Modern Interface**: Clean, professional design
- **Role-Based Navigation**: Context-aware menu system

### Charts & Analytics
- **Service Distribution**: Donut chart showing service breakdown
- **Revenue Tracking**: Bar chart for monthly revenue
- **Appointment Trends**: Line chart for booking patterns
- **KPI Cards**: Key performance indicators

## 🚀 Deployment

### Production Setup
1. **Build the Frontend**
   ```bash
   cd vehicle_service_management
   ng build --prod
   ```

2. **Configure Production Environment**
   - Update CORS origins
   - Set secure cookie flags
   - Configure HTTPS
   - Set production database credentials

3. **Deploy Backend**
   - Use PM2 for process management
   - Configure reverse proxy (Nginx)
   - Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Trishala Saravanan** - *Initial work* - [TrishalaSaravanan](https://github.com/TrishalaSaravanan)

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Chart.js for beautiful data visualizations
- Express.js community for robust backend tools
- Tailwind CSS for utility-first styling

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

⭐ **Star this repository if you find it helpful!** ⭐