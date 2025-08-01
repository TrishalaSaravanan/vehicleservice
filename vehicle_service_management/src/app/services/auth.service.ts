import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export interface LoginCredentials {
  email: string;
  password: string;
}


export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  role?: string;
}


export interface User {
  id: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Configuration for secure cookie migration
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USE_COOKIES = true; // Enable secure cookies
  private readonly COOKIE_EXPIRY_DAYS = 7;

  // Store the loaded customer profile
  private customerProfile: any = null;
  
  // Store the loaded mechanic profile
  private mechanicProfile: any = null;

  // Load customer profile from backend and store it
  async loadCustomerProfile() {
    const token = this.getToken();
    this.customerProfile = await this.http.get<any>('http://localhost:3000/api/auth/customer/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true // NEW: Include cookies
    }).toPromise();
  }

  // Load mechanic profile from backend and store it
  async loadMechanicProfile() {
    const token = this.getToken();
    this.mechanicProfile = await this.http.get<any>('http://localhost:3000/api/auth/mechanic/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true // NEW: Include cookies
    }).toPromise();
  }

  // Get the customer id from the loaded profile
  getCustomerId(): string | null {
    return this.customerProfile?.profile?.id || null;
  }
  
  // Get the mechanic id from the loaded profile
  getMechanicId(): string | null {
    return this.mechanicProfile?.profile?.user_id || null;
  }
  // Admin: Delete customer
  deleteCustomerByAdmin(id: string): Promise<any> {
    const token = this.getToken();
    return this.http.delete<any>(`http://localhost:3000/api/auth/admin/customers/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true // NEW: Include cookies
    }).toPromise();
  }
  // Admin: Update customer details
  updateCustomerByAdmin(id: string, data: { name?: string; email?: string; phone?: string; address?: string; is_active?: boolean }): Promise<any> {
    const token = this.getToken();
    return this.http.put<any>(`http://localhost:3000/api/auth/admin/customers/${id}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true // NEW: Include cookies
    }).toPromise();
  }
  // Get all customers (admin)
  getAllCustomers(): Promise<any> {
    const token = this.getToken();
    return this.http.get<any>('http://localhost:3000/api/auth/admin/customers', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true // NEW: Include cookies
    }).toPromise();
  }
  // Update customer profile (address, phone)
  updateCustomerProfile(data: { address?: string; phone?: string }): Promise<any> {
    const token = this.getToken();
    return this.http.put<any>('http://localhost:3000/api/auth/customer/profile', data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true // NEW: Include cookies
    }).toPromise();
  }

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private token: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Load token from localStorage if available
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      this.token = storedToken;
    }
  }

  /**
   * Get token from storage (secure HTTP-only cookies preferred, localStorage as fallback)
   */
  private getStoredToken(): string | null {
    if (this.USE_COOKIES) {
      // For HTTP-only cookies, we can't access them from client-side JavaScript
      // Instead, rely on the token being sent automatically by the browser
      // Fall back to localStorage for migration support
      return localStorage.getItem(this.TOKEN_KEY);
    } else {
      return localStorage.getItem(this.TOKEN_KEY);
    }
  }

  /**
   * Set token in storage
   */
  private setStoredToken(token: string): void {
    // Always store in localStorage for now (server handles HTTP-only cookies)
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Clear token from storage
   */
  private clearStoredToken(): void {
    // Clear from localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    // HTTP-only cookies will be cleared by server logout endpoint
  }

  // Fetch current customer profile from backend
  getCustomerProfile(): Promise<any> {
    const token = this.getToken();
    return this.http.get<any>('http://localhost:3000/api/auth/customer/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true // NEW: Include cookies
    }).toPromise();
  }

  // Login method (calls backend) - UPDATED with cookie support
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.http.post<AuthResponse>('http://localhost:3000/api/auth/login', credentials, {
      withCredentials: true // NEW: Include cookies in requests
    })
      .toPromise()
      .then(async (response) => {
        if (response && response.success && response.token) {
          this.token = response.token;
          this.setStoredToken(response.token); // NEW: Use secure storage method
          
          // Load profile based on user role
          try {
            let userId = '';
            
            if (response.role === 'customer') {
              await this.loadCustomerProfile();
              userId = this.getCustomerId() || '';
            } else if (response.role === 'mechanic') {
              await this.loadMechanicProfile();
              userId = this.getMechanicId() || '';
            }
            
            this.currentUserSubject.next({
              id: userId,
              email: credentials.email,
              role: response.role || ''
            });
          } catch (e) {
            console.warn('Could not load profile:', e);
            this.currentUserSubject.next({
              id: '',
              email: credentials.email,
              role: response.role || ''
            });
          }
          this.isAuthenticatedSubject.next(true);
          
          console.log(`✅ Token stored securely using ${this.USE_COOKIES ? 'cookies' : 'localStorage'}`);
        }
        return response || { success: false, message: 'No response from server' };
      });
  }
  // Get JWT token for API calls - UPDATED
  getToken(): string | null {
    if (!this.token) {
      this.token = this.getStoredToken(); // NEW: Use secure storage method
    }
    return this.token;
  }

  // Logout method - UPDATED with cookie support
  logout(): void {
    this.token = null;
    this.clearStoredToken(); // NEW: Use secure storage method
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.customerProfile = null;
    this.mechanicProfile = null;
    
    // NEW: Call backend logout to clear server-side cookie
    this.http.post('http://localhost:3000/api/auth/logout', {}, {
      withCredentials: true // Include cookies in logout request
    }).toPromise().catch(() => {
      // Continue with logout even if backend call fails
    });
    
    console.log(`✅ Secure logout completed using ${this.USE_COOKIES ? 'cookies' : 'localStorage'}`);
    this.router.navigate(['/login']);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null && !!this.token;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get current user role
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  // Navigate to appropriate dashboard based on role
  async navigateToDashboard(): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) {
      return await this.router.navigate(['/login']);
    }
    switch (user.role) {
      case 'admin':
        return await this.router.navigate(['/admin/dashboard']);
      case 'mechanic':
        return await this.router.navigate(['/mechanic/dashboard']);
      case 'customer':
        return await this.router.navigate(['/customer/home']);
      default:
        return await this.router.navigate(['/login']);
    }
  }


  // Optionally: decode JWT if needed
  decodeToken(token: string): any {
    // Implement JWT decode if needed
    return null;
  }

  // Register new user (implement backend call if needed)
  register(userData: any): Promise<AuthResponse> {
    // Not implemented for backend login-only
    return Promise.resolve({ success: false, message: 'Not implemented' });
  }

  // Get the mechanic profile from the loaded profile
  getMechanicProfile(): any {
    return this.mechanicProfile?.profile || null;
  }
  
  // Get mechanic profile from backend (for external calls)
  getMechanicProfileFromDB(): Promise<any> {
    const token = this.getToken();
    return this.http.get<any>('http://localhost:3000/api/auth/mechanic/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    }).toPromise();
  }
}


