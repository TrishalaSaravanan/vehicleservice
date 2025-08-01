import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from './cookie.service';

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
  // Configuration for token storage
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USE_COOKIES = true; // Set to true to use cookies, false for localStorage
  private readonly COOKIE_EXPIRY_DAYS = 7; // JWT token expires in 7 days

  // Store the loaded customer profile
  private customerProfile: any = null;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private token: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication by loading token from storage
   * This handles migration from localStorage to cookies
   */
  private initializeAuth(): void {
    // Try to get token from preferred storage method
    let storedToken = this.getStoredToken();

    // If no token found and we're using cookies, check localStorage for migration
    if (!storedToken && this.USE_COOKIES) {
      const localStorageToken = localStorage.getItem(this.TOKEN_KEY);
      if (localStorageToken) {
        console.log('🔄 Migrating token from localStorage to cookies...');
        // Migrate token from localStorage to cookies
        this.setStoredToken(localStorageToken);
        // Remove from localStorage after successful migration
        localStorage.removeItem(this.TOKEN_KEY);
        storedToken = localStorageToken;
        console.log('✅ Token migration completed successfully!');
      }
    }

    if (storedToken) {
      this.token = storedToken;
      // Optionally validate token here
      this.validateAndSetUser(storedToken);
    }
  }

  /**
   * Validate token and set user state
   */
  private async validateAndSetUser(token: string): Promise<void> {
    try {
      // You can add token validation logic here
      // For now, we'll just set authenticated state
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      console.error('Token validation failed:', error);
      this.clearStoredToken();
      this.token = null;
    }
  }

  /**
   * Get token from storage (localStorage or cookies)
   */
  private getStoredToken(): string | null {
    if (this.USE_COOKIES) {
      return this.cookieService.getCookie(this.TOKEN_KEY);
    } else {
      return localStorage.getItem(this.TOKEN_KEY);
    }
  }

  /**
   * Set token in storage (localStorage or cookies)
   */
  private setStoredToken(token: string): void {
    if (this.USE_COOKIES) {
      this.cookieService.setCookie(this.TOKEN_KEY, token, {
        expires: this.COOKIE_EXPIRY_DAYS,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
        path: '/'
      });
    } else {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Clear token from storage
   */
  private clearStoredToken(): void {
    if (this.USE_COOKIES) {
      this.cookieService.deleteCookie(this.TOKEN_KEY);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    // Also clear from localStorage as backup (for migration scenarios)
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Load customer profile from backend and store it
  async loadCustomerProfile() {
    const token = this.getToken();
    this.customerProfile = await this.http.get<any>('/api/auth/customer/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).toPromise();
  }

  // Load mechanic profile from backend and store it
  async loadMechanicProfile() {
    const token = this.getToken();
    this.customerProfile = await this.http.get<any>('/api/auth/mechanic/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).toPromise();
  }

  // Get the customer id from the loaded profile
  getCustomerId(): string | null {
    return this.customerProfile?.profile?.id || null;
  }

  // Admin: Delete customer
  deleteCustomerByAdmin(id: string): Promise<any> {
    const token = this.getToken();
    return this.http.delete<any>(`/api/auth/admin/customers/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).toPromise();
  }

  // Admin: Update customer details
  updateCustomerByAdmin(id: string, data: { name?: string; email?: string; phone?: string; address?: string; is_active?: boolean }): Promise<any> {
    const token = this.getToken();
    return this.http.put<any>(`/api/auth/admin/customers/${id}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).toPromise();
  }

  // Get all customers (admin)
  getAllCustomers(): Promise<any> {
    const token = this.getToken();
    return this.http.get<any>('/api/auth/admin/customers', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).toPromise();
  }

  // Update customer profile (address, phone)
  updateCustomerProfile(data: { address?: string; phone?: string }): Promise<any> {
    const token = this.getToken();
    return this.http.put<any>('/api/auth/customer/profile', data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).toPromise();
  }

  // Fetch current customer profile from backend
  getCustomerProfile(): Promise<any> {
    const token = this.getToken();
    return this.http.get<any>('/api/auth/customer/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).toPromise();
  }

  // Login method (calls backend)
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.http.post<AuthResponse>('http://localhost:3000/api/auth/login', credentials)
      .toPromise()
      .then(async (response) => {
        if (response && response.success && response.token) {
          this.token = response.token;
          this.setStoredToken(response.token); // Use the new storage method
          
          // Load and store customer profile
          try {
            await this.loadCustomerProfile();
            const id = this.getCustomerId() || '';
            this.currentUserSubject.next({
              id,
              email: credentials.email,
              role: response.role || ''
            });
          } catch (e) {
            this.currentUserSubject.next({
              id: '',
              email: credentials.email,
              role: response.role || ''
            });
          }
          this.isAuthenticatedSubject.next(true);
          
          console.log(`✅ Token stored in ${this.USE_COOKIES ? 'cookies' : 'localStorage'}`);
        }
        return response || { success: false, message: 'No response from server' };
      });
  }

  // Get JWT token for API calls
  getToken(): string | null {
    if (!this.token) {
      this.token = this.getStoredToken();
    }
    return this.token;
  }

  // Logout method
  logout(): void {
    this.token = null;
    this.clearStoredToken(); // Use the new clear method
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.customerProfile = null;
    console.log(`✅ Token cleared from ${this.USE_COOKIES ? 'cookies' : 'localStorage'}`);
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
    return this.customerProfile?.profile || null;
  }

  /**
   * Utility method to check current storage method
   */
  getCurrentStorageMethod(): string {
    return this.USE_COOKIES ? 'cookies' : 'localStorage';
  }

  /**
   * Utility method to manually migrate token (for testing)
   */
  migrateTokenToCookies(): boolean {
    const localStorageToken = localStorage.getItem(this.TOKEN_KEY);
    if (localStorageToken) {
      this.cookieService.setCookie(this.TOKEN_KEY, localStorageToken, {
        expires: this.COOKIE_EXPIRY_DAYS,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
        path: '/'
      });
      localStorage.removeItem(this.TOKEN_KEY);
      console.log('✅ Manual token migration to cookies completed!');
      return true;
    }
    return false;
  }
}
