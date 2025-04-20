import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const token = this.authService.getToken();
    const user = this.authService.getUser();

    // ❌ Token manquant ou expiré
    if (!token || this.authService['jwtHelper'].isTokenExpired(token)) {
      this.authService.logout();
      this.router.navigate(['/login'], { queryParams: { expired: true } });
      return false;
    }

    // ❌ Utilisateur non trouvé (théoriquement rare ici)
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // ❌ Mauvais rôle
    if (expectedRole && user.role !== expectedRole) {
      this.router.navigate(['/']);
      return false;
    }

    // ✅ Tout est ok
    return true;
  }
}
