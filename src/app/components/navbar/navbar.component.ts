import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
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
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    // 🔥 Écoute les changements d'état utilisateur en temps réel
    this.authService.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin';
      this.isClient = user?.role === 'client';
      this.isEmployee = user?.role === 'employee';
      this.typeEspace = user?.role;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isInAdminPage = this.router.url.startsWith('/admin');
        this.isInClientPage = this.router.url.startsWith('/client');
        this.isInEmployeePage = this.router.url.startsWith('/employee');
        this.isInAcceuillPage = this.router.url === '/';
      }
    });
  }

  logout() {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, déconnectez-moi !',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#b8860b',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/']);
        Swal.fire({
          icon: 'success',
          title: 'Déconnexion réussie',
          text: 'Vous avez été déconnecté avec succès.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#b8860b',
        });
      }
    });
  }

  getUser() {
    return this.authService.getUser();
  }

  priseRendezVous() {
    this.isMenuOpen = false; // Ferme le menu si ouvert
    if (!this.isLoggedIn) {
      Swal.fire({
        icon: 'info',
        title: 'Connexion requise',
        text: 'Veuillez vous connecter pour prendre un rendez-vous.',
        confirmButtonText: 'Se connecter',
        confirmButtonColor: '#b8860b',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
    } else if (this.isClient) {
      this.router.navigate(['/client/dashboard']);
    }
  }

  goToAcceuil() {
    this.isMenuOpen = false; // Ferme le menu si ouvert
    this.router.navigate(['/']);
  }

  goToServices() {
    this.isMenuOpen = false; // Ferme le menu si ouvert
    this.router.navigate(['/services']);
  }

  goToContact() {
    this.isMenuOpen = false; // Ferme le menu si ouvert
    this.router.navigate(['/contact']);
  }

  goToAbout() {
    this.isMenuOpen = false; // Ferme le menu si ouvert
    this.router.navigate(['/about']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
