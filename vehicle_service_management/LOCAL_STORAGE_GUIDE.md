# Local Storage Implementation Guide

## Overview

This Vehicle Service Management application now includes a comprehensive local storage system for managing admin, mechanic, and customer data. The implementation provides persistent data storage using the browser's localStorage API.

## Key Features

### 1. User Management
- **Admin Users**: Full system access with permissions and department management
- **Mechanic Users**: Service providers with specializations, certifications, and employee tracking
- **Customer Users**: Service recipients with vehicle management and service history

### 2. Data Persistence
- All user data is stored in browser localStorage
- Data persists across browser sessions
- Automatic initialization with default users
- Export/import functionality for data backup

### 3. Authentication System
- Secure login/logout functionality
- Role-based access control
- Session management
- Password validation

## Services

### LocalStorageService (`src/app/services/local-storage.service.ts`)

The core service managing all data operations:

#### Key Methods:
- `getUsers()`: Retrieve all users
- `getUserById(id)`: Get user by ID
- `getUserByEmail(email)`: Get user by email
- `addUser(user)`: Add new user
- `updateUser(user)`: Update existing user
- `deleteUser(id)`: Remove user
- `getAdmins()`: Get all admin users
- `getMechanics()`: Get all mechanic users
- `getCustomers()`: Get all customer users
- `validateUser(email, password)`: Authenticate user
- `setCurrentUser(user)`: Set logged-in user
- `getCurrentUser()`: Get current logged-in user
- `clearCurrentUser()`: Logout current user

#### Data Models:

```typescript
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'mechanic' | 'customer';
  phone?: string;
  address?: string;
  createdAt: Date;
  isActive: boolean;
}

interface Admin extends User {
  role: 'admin';
  permissions: string[];
  department: string;
}

interface Mechanic extends User {
  role: 'mechanic';
  specialization: string[];
  experience: number;
  certification: string[];
  employeeId: string;
}

interface Customer extends User {
  role: 'customer';
  vehicles: Vehicle[];
  preferredMechanic?: string;
}
```

### AuthService (`src/app/services/auth.service.ts`)

Handles authentication and authorization:

#### Key Methods:
- `login(credentials)`: Authenticate user
- `logout()`: End user session
- `register(userData)`: Create new user account
- `getCurrentUser()`: Get current logged-in user
- `hasRole(role)`: Check user role
- `navigateToDashboard()`: Route to appropriate dashboard
- `updateProfile(userData)`: Update user profile
- `changePassword(current, new)`: Change user password

## Default Users

The system initializes with three default users:

### Admin User
- **Email**: admin@mechniq.com
- **Password**: admin123
- **Role**: admin
- **Access**: Full system administration

### Mechanic User
- **Email**: mechanic@mechniq.com
- **Password**: mechanic123
- **Role**: mechanic
- **Access**: Mechanic dashboard and tools

### Customer User
- **Email**: customer@mechniq.com
- **Password**: customer123
- **Role**: customer
- **Access**: Customer portal and services

## Storage Demo Component

A demo component (`/storage-demo`) is available to:
- View all stored users
- Add new users
- Edit user status
- Delete users
- Export data
- Clear all data
- Reset to default data

## Usage Examples

### Login Process
```typescript
// In your component
constructor(private authService: AuthService) {}

login() {
  const result = this.authService.login({
    email: 'admin@mechniq.com',
    password: 'admin123'
  });
  
  if (result.success) {
    // Login successful, navigate to dashboard
    this.authService.navigateToDashboard();
  } else {
    // Handle login error
    console.error(result.message);
  }
}
```

### Adding New User
```typescript
// In your component
constructor(private authService: AuthService) {}

addUser() {
  const result = this.authService.register({
    name: 'New User',
    email: 'newuser@example.com',
    password: 'password123',
    role: 'customer',
    phone: '+1-555-0123',
    address: '123 Main St',
    isActive: true
  });
  
  if (result.success) {
    console.log('User created successfully');
  }
}
```

### Getting Current User
```typescript
// In your component
constructor(private authService: AuthService) {}

ngOnInit() {
  const currentUser = this.authService.getCurrentUser();
  if (currentUser) {
    console.log('Current user:', currentUser.name, currentUser.role);
  }
}
```

### Role-Based Access
```typescript
// In your component
constructor(private authService: AuthService) {}

checkAccess() {
  if (this.authService.hasRole('admin')) {
    // Admin-only functionality
  } else if (this.authService.hasRole('mechanic')) {
    // Mechanic-only functionality
  } else if (this.authService.hasRole('customer')) {
    // Customer-only functionality
  }
}
```

## Data Storage Structure

Data is stored in localStorage with the following keys:
- `mechniq_users`: All user accounts
- `mechniq_current_user`: Currently logged-in user
- `mechniq_vehicles`: Vehicle information

## Security Considerations

1. **Password Storage**: Passwords are stored in plain text for demo purposes. In production, use proper hashing.
2. **Token Management**: Simple tokens are generated for demo. Use JWT or similar in production.
3. **Data Validation**: Client-side validation only. Add server-side validation in production.
4. **Session Management**: Basic session handling. Implement proper session management in production.

## Browser Compatibility

The localStorage implementation works in all modern browsers:
- Chrome 4+
- Firefox 3.5+
- Safari 4+
- Internet Explorer 8+
- Edge (all versions)

## Data Limits

localStorage has a storage limit of approximately 5-10MB per origin, which is sufficient for user data in this application.

## Testing the Implementation

1. Navigate to `/login` and try logging in with default users
2. Visit `/storage-demo` to see all stored data and management features
3. Create new users and observe data persistence
4. Test role-based navigation after login
5. Try logout and login again to verify session management

## Future Enhancements

1. **Encryption**: Add client-side encryption for sensitive data
2. **Sync**: Implement cloud sync for data backup
3. **Offline Mode**: Enhanced offline functionality
4. **Data Migration**: Version management for data schema changes
5. **Compression**: Compress stored data for better space utilization

## Troubleshooting

### Common Issues:
1. **Storage Full**: Clear localStorage if hitting storage limits
2. **Data Corruption**: Use the reset function in storage demo
3. **Login Issues**: Verify default user credentials
4. **Browser Compatibility**: Check localStorage support

### Debug Tools:
- Browser DevTools > Application > Local Storage
- Storage Demo component for data inspection
- Console logging in services for debugging

## API Reference

For complete API documentation, refer to the TypeScript interfaces and JSDoc comments in the service files.
