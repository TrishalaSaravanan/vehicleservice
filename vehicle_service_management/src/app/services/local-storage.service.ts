import { Injectable } from '@angular/core';

export interface User {
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

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
  department: string;
}

export interface Mechanic extends User {
  role: 'mechanic';
  specialization: string[];
  experience: number;
  certification: string[];
  employeeId: string;
}

export interface Customer extends User {
  role: 'customer';
  vehicles: Vehicle[];
  preferredMechanic?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  customerId: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  services: string[];
  date: string; // ISO string or date string
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly STORAGE_KEYS = {
    USERS: 'mechniq_users',
    CURRENT_USER: 'mechniq_current_user',
    ADMINS: 'mechniq_admins',
    MECHANICS: 'mechniq_mechanics',
    CUSTOMERS: 'mechniq_customers',
    VEHICLES: 'mechniq_vehicles',
    APPOINTMENTS: 'mechniq_appointments'
    ,PARTS: 'mechniq_parts',
    SERVICES: 'mechniq_services'
  };
// PARTS INVENTORY
getParts(): any[] {
  return this.getItem<any[]>(this.STORAGE_KEYS.PARTS) || [];
}

setParts(parts: any[]): void {
  this.setItem(this.STORAGE_KEYS.PARTS, parts);
}

addPart(part: any): boolean {
  try {
    const parts = this.getParts();
    parts.push(part);
    this.setParts(parts);
    return true;
  } catch (error) {
    console.error('Error adding part:', error);
    return false;
  }
}

updatePart(part: any): boolean {
  try {
    const parts = this.getParts();
    const idx = parts.findIndex((p: any) => p.id === part.id);
    if (idx !== -1) {
      parts[idx] = part;
      this.setParts(parts);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating part:', error);
    return false;
  }
}

deletePart(id: string): boolean {
  try {
    const parts = this.getParts();
    const filtered = parts.filter((p: any) => p.id !== id);
    if (filtered.length !== parts.length) {
      this.setParts(filtered);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting part:', error);
    return false;
  }
}

// SERVICE CATALOG
getServicesCatalog(): any[] {
  return this.getItem<any[]>(this.STORAGE_KEYS.SERVICES) || [];
}

setServicesCatalog(services: any[]): void {
  this.setItem(this.STORAGE_KEYS.SERVICES, services);
}

addServiceToCatalog(service: any): boolean {
  try {
    const services = this.getServicesCatalog();
    services.push(service);
    this.setServicesCatalog(services);
    return true;
  } catch (error) {
    console.error('Error adding service:', error);
    return false;
  }
}

updateServiceInCatalog(service: any): boolean {
  try {
    const services = this.getServicesCatalog();
    const idx = services.findIndex((s: any) => s.id === service.id);
    if (idx !== -1) {
      services[idx] = service;
      this.setServicesCatalog(services);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating service:', error);
    return false;
  }
}

deleteServiceFromCatalog(id: string): boolean {
  try {
    const services = this.getServicesCatalog();
    const filtered = services.filter((s: any) => s.id !== id);
    if (filtered.length !== services.length) {
      this.setServicesCatalog(filtered);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting service:', error);
    return false;
  }
}

  constructor() {
    this.forceReinitializeUsers(); // TEMP: Force reset users for login troubleshooting
    this.initializeDefaultData();
  }

  // Initialize default users if not present
  private initializeDefaultData(): void {
    if (!this.getUsers().length) {
      console.log('No users found, initializing default users');
      this.initializeDefaultUsers();
    } else {
      console.log('Users already exist in storage:', this.getUsers().length);
    }
  }

  private initializeDefaultUsers(): void {
    const defaultUsers: User[] = [
      {
        id: 'admin_001',
        email: 'admin@mechniq.com',
        password: 'admin123',
        name: 'System Administrator',
        role: 'admin',
        phone: '+1-555-0001',
        address: '123 Admin Street, Admin City',
        createdAt: new Date(),
        isActive: true,
        permissions: ['user_management', 'content_management', 'reports', 'settings'],
        department: 'IT Administration'
      } as Admin,
      {
        id: 'mechanic_001',
        email: 'mechanic@mechniq.com',
        password: 'mechanic123',
        name: 'Bennet', // updated from 'John Smith' to 'Bennet'
        role: 'mechanic',
        phone: '+1-555-0002',
        address: '456 Mechanic Avenue, Service City',
        createdAt: new Date(),
        isActive: true,
        specialization: ['Engine Repair', 'Brake Service', 'AC Service'],
        experience: 8,
        certification: ['ASE Certified', 'Brake Specialist'],
        employeeId: 'EMP001'
      } as Mechanic,
      {
        id: 'customer_001',
        email: 'customer@mechniq.com',
        password: 'customer123',
        name: 'Profile',
        role: 'customer',
        phone: '+1-555-0003',
        address: '789 Customer Lane, Client City',
        createdAt: new Date(),
        isActive: true,
        vehicles: [
          {
            id: 'vehicle_001',
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            vin: '1HGCM82633A123456',
            licensePlate: 'ABC-1234',
            customerId: 'customer_001'
          }
        ],
        preferredMechanic: 'mechanic_001'
      } as Customer
    ];

    this.setUsers(defaultUsers);
    console.log('Default users initialized:', defaultUsers);
  }

  // Generic storage methods
  private setItem(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  // User management methods
  getUsers(): User[] {
    return this.getItem<User[]>(this.STORAGE_KEYS.USERS) || [];
  }

  setUsers(users: User[]): void {
    this.setItem(this.STORAGE_KEYS.USERS, users);
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  addUser(user: User): boolean {
    try {
      const users = this.getUsers();
      
      // Check if user already exists
      if (users.find(u => u.email === user.email)) {
        return false;
      }

      users.push(user);
      this.setUsers(users);
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  }

  updateUser(user: User): boolean {
    try {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === user.id);
      
      if (index !== -1) {
        users[index] = user;
        this.setUsers(users);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  deleteUser(id: string): boolean {
    try {
      const users = this.getUsers();
      const filteredUsers = users.filter(user => user.id !== id);
      
      if (filteredUsers.length !== users.length) {
        this.setUsers(filteredUsers);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Role-specific methods
  getAdmins(): Admin[] {
    return this.getUsers().filter(user => user.role === 'admin') as Admin[];
  }

  getMechanics(): Mechanic[] {
    return this.getUsers().filter(user => user.role === 'mechanic') as Mechanic[];
  }

  getCustomers(): Customer[] {
    return this.getUsers().filter(user => user.role === 'customer') as Customer[];
  }

  // Current user session management
  setCurrentUser(user: User): void {
    this.setItem(this.STORAGE_KEYS.CURRENT_USER, user);
  }

  getCurrentUser(): User | null {
    return this.getItem<User>(this.STORAGE_KEYS.CURRENT_USER);
  }

  clearCurrentUser(): void {
    this.removeItem(this.STORAGE_KEYS.CURRENT_USER);
  }

  // Authentication helper
  validateUser(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    console.log('Validating user:', email, 'Found:', user);
    if (user && user.password === password && user.isActive) {
      return user;
    }
    if (user && user.password !== password) {
      console.warn('Password mismatch for', email);
    }
    if (user && !user.isActive) {
      console.warn('User is not active:', email);
    }
    return null;
  }

  // Vehicle management
  getVehicles(): Vehicle[] {
    return this.getItem<Vehicle[]>(this.STORAGE_KEYS.VEHICLES) || [];
  }

  setVehicles(vehicles: Vehicle[]): void {
    this.setItem(this.STORAGE_KEYS.VEHICLES, vehicles);
  }

  addVehicle(vehicle: Vehicle): boolean {
    try {
      const vehicles = this.getVehicles();
      vehicles.push(vehicle);
      this.setVehicles(vehicles);
      
      // Update customer's vehicle list
      const customer = this.getUserById(vehicle.customerId) as Customer;
      if (customer) {
        customer.vehicles.push(vehicle);
        this.updateUser(customer);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      return false;
    }
  }

  getCustomerVehicles(customerId: string): Vehicle[] {
    return this.getVehicles().filter(vehicle => vehicle.customerId === customerId);
  }

  // Appointment management
  getAppointments(): Appointment[] {
    return this.getItem<Appointment[]>(this.STORAGE_KEYS.APPOINTMENTS) || [];
  }

  setAppointments(appointments: Appointment[]): void {
    this.setItem(this.STORAGE_KEYS.APPOINTMENTS, appointments);
  }

  addAppointment(appointment: Appointment): boolean {
    try {
      const appointments = this.getAppointments();
      appointments.push(appointment);
      this.setAppointments(appointments);
      return true;
    } catch (error) {
      console.error('Error adding appointment:', error);
      return false;
    }
  }

  getCustomerAppointments(customerId: string): Appointment[] {
    return this.getAppointments().filter(a => a.customerId === customerId);
  }

  // Clear all data
  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }

  // Export data for backup
  exportData(): any {
    const data: any = {};
    Object.entries(this.STORAGE_KEYS).forEach(([key, storageKey]) => {
      data[key] = this.getItem(storageKey);
    });
    return data;
  }

  // Import data from backup
  importData(data: any): boolean {
    try {
      Object.entries(this.STORAGE_KEYS).forEach(([key, storageKey]) => {
        if (data[key]) {
          this.setItem(storageKey, data[key]);
        }
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Force reinitialize default users (for testing)
  forceReinitializeUsers(): void {
    this.clearAllData();
    this.initializeDefaultUsers();
    console.log('Users reinitialized. Available users:', this.getUsers());
  }
}
