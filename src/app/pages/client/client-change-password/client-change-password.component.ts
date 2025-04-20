import { Component, OnInit } from '@angular/core';
import { AdminChangePasswordComponent } from "../../admin/admin-change-password/admin-change-password.component";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-client-change-password',
  imports: [AdminChangePasswordComponent],
  templateUrl: './client-change-password.component.html',
  styleUrl: './client-change-password.component.scss'
})
export class ClientChangePasswordComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
  }

}
