import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-layout.component.html',
  styleUrls: ['./employee-layout.component.scss']
})
export class EmployeeLayoutComponent implements OnInit {
  constructor(private authService: AuthService, private router : Router) {}

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
  }

  goToDashboard() {
    if(!this.authService.autoLogoutIfExpired()) {
      this.router.navigate(['/employee/dashboard']);
    }
  }

  goToDisponibilites() {
    if(!this.authService.autoLogoutIfExpired()) {
      this.router.navigate(['/employee/disponibilite']);
    }
  }

  goToChangePassword() {
    if(!this.authService.autoLogoutIfExpired()) {
      this.router.navigate(['/employee/change-password']);
    }
  }
}
