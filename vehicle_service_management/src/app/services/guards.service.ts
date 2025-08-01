import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      // Check if user has required role if specified in route data
      const requiredRole = route.data?.['role'];
      if (requiredRole) {
        const userRole = this.authService.getCurrentUserRole();
        if (userRole !== requiredRole) {
          // Redirect to appropriate dashboard
          this.authService.navigateToDashboard();
          return false;
        }
      }
      return true;
    } else {
      // Not logged in, redirect to login page
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data?.['roles'] as string[];
    const userRole = this.authService.getCurrentUserRole();

    if (requiredRoles && requiredRoles.length > 0) {
      if (!userRole || !requiredRoles.includes(userRole)) {
        // User doesn't have required role
        this.authService.navigateToDashboard();
        return false;
      }
    }

    return true;
  }
}
