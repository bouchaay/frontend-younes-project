import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import {
  trigger,
  transition,
  style,
  animate,
  query
} from '@angular/animations';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0 }),
          animate('1500ms ease-in-out', style({ opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent {
  title = 'salon-beaute';
  isLoggedIn = false;
  isLoading = true; // Affiche le spinner au démarrage uniquement

  constructor(private authService: AuthService, private router: Router) {
    this.checkAuthStatus();

    // Spinner visible uniquement au chargement initial
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      take(1)
    ).subscribe(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 1500); // petit délai pour rendre le spinner fluide
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? '';
  }

  checkAuthStatus() {
    const token = this.authService.getToken();
    this.isLoggedIn = token !== null && !this.authService.isTokenExpired();
  }
}
