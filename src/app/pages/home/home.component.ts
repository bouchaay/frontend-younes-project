import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private router: Router, private authService: AuthService) {}

  toServices() {
    this.router.navigateByUrl('/services');
  }

  toContact() {
    // vérifier si l'utilisateur est connecté en tant que client
    if (this.authService.getUser()?.role === 'client') {
      this.router.navigateByUrl('/contact');
    } else if (this.authService.getUser()?.role === 'employee') {
      alert('Un employé ne peut pas prendre de rendez-vous.');
    } else if (this.authService.getUser()?.role === 'admin') {
      alert('Un administrateur ne peut pas prendre de rendez-vous.');
    } else {
      this.router.navigateByUrl('/contact');
    }
  }

  prendreRdv() {
    // vérifier si l'utilisateur est connecté en tant que client
    if (this.authService.getUser()?.role === 'client') {
      this.router.navigateByUrl('/client');
    } else if (this.authService.getUser()?.role === 'employee') {
      alert('Un employé ne peut pas prendre de rendez-vous.');
    } else if (this.authService.getUser()?.role === 'admin') {
      alert('Un administrateur ne peut pas prendre de rendez-vous.');
    } else {
      this.router.navigateByUrl('/login');
      alert('Vous devez être connecté en tant que client pour prendre un rendez-vous.');
    }
  }
}
