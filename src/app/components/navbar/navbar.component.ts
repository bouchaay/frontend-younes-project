import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
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
  selectedLang = 'fr';

  constructor(
    private authService: AuthService,
    private router: Router,
    public translate: TranslateService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isInAdminPage = this.router.url.startsWith('/admin');
        this.isInClientPage = this.router.url.startsWith('/client');
        this.isInEmployeePage = this.router.url.startsWith('/employee');
        this.isInAcceuillPage = this.router.url === '/';
      }
    });

    this.authService.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin';
      this.isClient = user?.role === 'client';
      this.isEmployee = user?.role === 'employee';
      this.typeEspace = user?.role;
    });
  }

  ngOnInit(): void {
    const savedLang = this.isBrowser() ? localStorage.getItem('lang') : null;
    const browserLang = this.translate.getBrowserLang();
    this.selectedLang = savedLang || (browserLang?.match(/fr|en/) ? browserLang : 'fr');

    this.translate.setDefaultLang('fr');
    this.translate.use(this.selectedLang);
  }

  switchLang(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLang = selectElement.value;
    this.translate.use(this.selectedLang);
    if (this.isBrowser()) {
      localStorage.setItem('lang', this.selectedLang);
    }
  }

  logout() {
    Swal.fire({
      title: this.translate.instant('NAV.LOGOUT_TITLE'),
      text: this.translate.instant('NAV.LOGOUT_MSG'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('NAV.LOGOUT_CONFIRM'),
      cancelButtonText: this.translate.instant('NAV.CANCEL'),
      confirmButtonColor: '#b8860b',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/']);
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('NAV.LOGOUT_SUCCESS_TITLE'),
          text: this.translate.instant('NAV.LOGOUT_SUCCESS_MSG'),
          confirmButtonText: 'OK',
          confirmButtonColor: '#b8860b',
        });
      }
    });
  }

  priseRendezVous() {
    this.isMenuOpen = false;
    if (!this.isLoggedIn) {
      Swal.fire({
        icon: 'info',
        title: this.translate.instant('NAV.LOGIN_REQUIRED'),
        text: this.translate.instant('NAV.LOGIN_REQUIRED_MSG'),
        confirmButtonText: this.translate.instant('NAV.LOGIN'),
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
    this.isMenuOpen = false;
    this.router.navigate(['/']);
  }

  goToServices() {
    this.isMenuOpen = false;
    this.router.navigate(['/services']);
  }

  goToContact() {
    this.isMenuOpen = false;
    this.router.navigate(['/contact']);
  }

  goToAbout() {
    this.isMenuOpen = false;
    this.router.navigate(['/about']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getUser() {
    return this.authService.getUser();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
