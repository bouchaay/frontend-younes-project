import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [RouterModule],
})
export class AdminDashboardComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
  }

  goToUsers() {
    if(!this.authService.autoLogoutIfExpired()) {
      this.router.navigateByUrl('/admin/users');
    }
  }

  goToAppointments() {
    if (!this.authService.autoLogoutIfExpired()) {
      this.router.navigateByUrl('/admin/appointments');
    }
  }

  goToChangePassword() {
    if (!this.authService.autoLogoutIfExpired()) {
      this.router.navigateByUrl('/admin/change-password');
    }
  }
}
