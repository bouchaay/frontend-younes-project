import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'; // ✅ Gestion des JWT
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<{ email: string; role: string; name: string } | null>(null);
  user$ = this.userSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/auth`;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    if (this.isBrowser()) {
      const token = this.getToken();
      if (token) {
        this.handleAuthResponse(token);
      }
    }
  }

  // 🔹 Login en envoyant les identifiants au backend
  login(email: string, phone: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, phone }).pipe(
      tap(response => this.handleAuthResponse(response.token))
    );
  }

  private handleAuthResponse(token: string) {
    if (!this.isBrowser()) return;

    localStorage.setItem('token', token);

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log("🔍 Token décodé :", decodedToken); // ✅ Vérification du contenu du token

      const user = { 
        email: decodedToken.sub, 
        role: decodedToken.role || 'client', 
        name: decodedToken.name || 'Utilisateur' // ✅ Récupération du nom
      };

      console.log("👤 Utilisateur après décodage :", user); // ✅ Vérifie que "name" est bien récupéré

      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
    } catch (error) {
      console.error("❌ Erreur lors du décodage du JWT", error);
      this.logout();
    }
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  getUser() {
    return this.userSubject.value;
  }

  getRole(): string {
    return this.getUser()?.role || 'client'; // ✅ 'client' par défaut
  }

  // 🔹 Retourne le nom de l'utilisateur connecté
  getUserName(): string {
    return this.getUser()?.name || 'Utilisateur';
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
  }

  register(user: User) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // ✅ Vérification si on est bien dans un environnement navigateur
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  autoLogoutIfExpired(): boolean {
    const token = this.getToken();
    if (token && this.jwtHelper.isTokenExpired(token)) {
      console.warn('🚪 Token expiré : déconnexion automatique');
      this.logout();
      alert('Votre session a expiré. Veuillez vous reconnecter.');
      // rafarchir la page pour forcer la reconnexion
      window.location.reload();
      return true;
    }
    return false;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    return token ? this.jwtHelper.isTokenExpired(token) : true; // ✅ Si pas de token, considéré comme expiré
  }
}
