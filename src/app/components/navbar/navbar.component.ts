import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isLoggedIn = false;
  isInAdminPage = false;
  isInClientPage = false;
  isInEmployeePage = false;
  isInAcceuillPage = false;
  isAdmin = false;
  isClient = false;
  isEmployee = false;
  typeEspace?: string;

  constructor(private authService: AuthService, private router: Router) {
    // 🔥 Écoute les changements d'état utilisateur en temps réel
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user; // Convertit en boolean
      this.isAdmin = user?.role === 'admin'; // Vérifie le rôle
      this.isClient = user?.role === 'client'; // Vérifie le rôle
      this.isEmployee = user?.role === 'employee'; // Vérifie le rôle
      this.typeEspace = user?.role;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Vérifie si l'URL actuelle contient "/admin"
        this.isInAdminPage = this.router.url.startsWith('/admin');
        this.isInClientPage = this.router.url.startsWith('/client');
        this.isInEmployeePage = this.router.url.startsWith('/employee');
        this.isInAcceuillPage = this.router.url === '/';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUser() {
    return this.authService.getUser();
  }
}
