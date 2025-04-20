import { Component, OnInit } from '@angular/core';
import { AdminChangePasswordComponent } from "../../admin/admin-change-password/admin-change-password.component";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-employee-change-password',
  imports: [AdminChangePasswordComponent],
  templateUrl: './employee-change-password.component.html',
  styleUrl: './employee-change-password.component.scss'
})
export class EmployeeChangePasswordComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
  }

}
