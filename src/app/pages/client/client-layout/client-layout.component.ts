import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-client-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss'
})
export class ClientLayoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
  }

  goToDashboard() {
    if (!this.authService.autoLogoutIfExpired()) {
      this.router.navigateByUrl('/client/dashboard');
    }
  }

  goToChangePassword() {
    if (!this.authService.autoLogoutIfExpired()) {
      this.router.navigateByUrl('/client/change-password');
    }
  }

  goToProfile() {
    if (!this.authService.autoLogoutIfExpired()) {
      this.router.navigateByUrl('/client/profile');
    }
  }
}
