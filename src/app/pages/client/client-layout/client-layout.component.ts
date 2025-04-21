import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-client-layout',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss'
})
export class ClientLayoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  isSidebarOpen = false;

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
  }

  goToDashboard() {
    if (!this.authService.autoLogoutIfExpired()) {
      this.isSidebarOpen = false; // Close the sidebar when navigating
      this.router.navigateByUrl('/client/dashboard');
    }
  }

  goToChangePassword() {
    if (!this.authService.autoLogoutIfExpired()) {
      this.isSidebarOpen = false; // Close the sidebar when navigating
      this.router.navigateByUrl('/client/change-password');
    }
  }

  goToProfile() {
    if (!this.authService.autoLogoutIfExpired()) {
      this.isSidebarOpen = false; // Close the sidebar when navigating
      this.router.navigateByUrl('/client/profile');
    }
  }

  toggleSidebar() {
    if (!this.authService.autoLogoutIfExpired()) {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }
}
