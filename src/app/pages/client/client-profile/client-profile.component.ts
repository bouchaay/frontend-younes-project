import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { take } from 'rxjs';
import { User } from '../../../models/user.model';
import { userInfo } from 'os';
import { UserInfos } from '../../../models/user-infos.model';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {
  profileForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  currentUser!: User | null;
  lastName!: string;
  firstName!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
    const user = this.authService.getUser();
    this.userService.getUserByEmail(user?.email!).pipe(take(1)).subscribe({
      next: (data) => {
        this.currentUser = data;
      },
      error: (err) => console.error('❌ Erreur lors du chargement de l\'utilisateur :', err)
    });

    // Split the user name into first and last name
    console.log('Utilisateur name:', this.currentUser?.name);
    const nameParts = user?.name.split(' ');
    this.profileForm = this.fb.group({
      lastName: [nameParts ? nameParts[0] : ''],
      firstName: [nameParts ? nameParts.slice(1).join(' ') : ''],
      email: [this.currentUser?.email, Validators.email],
      phone: [this.currentUser?.phone],
    });

    this.lastName = nameParts ? nameParts[0] : '';
    this.firstName = nameParts ? nameParts.slice(1).join(' ') : '';
    console.log('Nom de famille:', this.lastName);
    console.log('Prénom:', this.firstName);
  }

  saveChanges(): void {
    this.authService.autoLogoutIfExpired();
    if (this.profileForm.invalid) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
      return;
    }

    const updatedUser = this.profileForm.value;
    const email = updatedUser.email == null ? this.currentUser?.email : updatedUser.email;
    const phone = updatedUser.phone == null ? this.currentUser?.phone : updatedUser.phone;
    const userInfo : UserInfos = {
      name: `${updatedUser.lastName} ${updatedUser.firstName}`,
      email: email,
      phone: phone
    };
    this.userService.updateUserInfos(this.currentUser?.id, userInfo).pipe(take(1)).subscribe({
      next: () => {
        this.successMessage = '✅ Informations mises à jour avec succès.';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = '❌ Erreur lors de la mise à jour.';
        this.successMessage = '';
      }
    });
  }
}
