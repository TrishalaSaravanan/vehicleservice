import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  /**
   * Set a cookie with secure defaults
   * @param name Cookie name
   * @param value Cookie value
   * @param options Cookie options
   */
  setCookie(name: string, value: string, options: {
    expires?: Date | number; // Date object or days from now
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
    httpOnly?: boolean;
  } = {}): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    // Set expiration (default: 7 days for JWT tokens)
    if (options.expires) {
      let expiresDate: Date;
      if (typeof options.expires === 'number') {
        expiresDate = new Date(Date.now() + options.expires * 24 * 60 * 60 * 1000);
      } else {
        expiresDate = options.expires;
      }
      cookieString += `; expires=${expiresDate.toUTCString()}`;
    }

    // Set path (default: '/')
    cookieString += `; path=${options.path || '/'}`;

    // Set domain if provided
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    // Set secure flag (default: true in production)
    if (options.secure !== false && (window.location.protocol === 'https:' || options.secure === true)) {
      cookieString += '; secure';
    }

    // Set SameSite (default: 'Lax' for JWT tokens)
    cookieString += `; samesite=${options.sameSite || 'Lax'}`;

    // HttpOnly cannot be set via JavaScript (only server-side)
    // We'll handle this on the backend if needed

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value by name
   * @param name Cookie name
   * @returns Cookie value or null if not found
   */
  getCookie(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  }

  /**
   * Delete a cookie by name
   * @param name Cookie name
   * @param path Cookie path (should match the path used when setting)
   * @param domain Cookie domain (should match the domain used when setting)
   */
  deleteCookie(name: string, path: string = '/', domain?: string): void {
    let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
    
    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;
  }

  /**
   * Check if a cookie exists
   * @param name Cookie name
   * @returns True if cookie exists, false otherwise
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  /**
   * Get all cookies as an object
   * @returns Object with cookie names as keys and values as values
   */
  getAllCookies(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    const cookieArray = document.cookie.split(';');

    for (let cookie of cookieArray) {
      const trimmed = cookie.trim();
      const [name, value] = trimmed.split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  }

  /**
   * Clear all cookies (for logout scenarios)
   * Note: This only clears cookies that can be accessed by JavaScript
   */
  clearAllCookies(): void {
    const cookies = this.getAllCookies();
    for (let cookieName in cookies) {
      this.deleteCookie(cookieName);
    }
  }
}
