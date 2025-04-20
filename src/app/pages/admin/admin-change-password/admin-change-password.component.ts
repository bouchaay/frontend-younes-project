import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { take } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class AdminChangePasswordComponent implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  users: User[] = [];
  adminUser?: User;

  showCurrentPassword: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.autoLogoutIfExpired();
    this.userService.getUsers().pipe(take(1)).subscribe({
      next: (users: User[]) => {
        this.users = users;
        const loggedInUser = this.authService.getUser();
        if (loggedInUser && loggedInUser.email) {
          this.adminUser = this.users.find(user => user.email === loggedInUser.email);
        }
        if (!this.adminUser) {
          this.errorMessage = "❌ Impossible de récupérer l'utilisateur.";
        }
      },
      error: () => {
        this.errorMessage = "❌ Erreur lors du chargement des utilisateurs.";
      }
    });
  }

  validatePassword(): void {
    this.authService.autoLogoutIfExpired();
    if (this.newPassword.length > 0 && this.newPassword.length < 6) {
      this.errorMessage = '⚠️ Le mot de passe doit contenir au moins 6 caractères.';
    } else if (this.confirmPassword.length > 0 && this.confirmPassword !== this.newPassword) {
      this.errorMessage = '⚠️ Les mots de passe ne correspondent pas.';
    } else {
      this.errorMessage = null;
    }
  }

  isFormValid(): boolean {
    this.authService.autoLogoutIfExpired();
    return (
      this.newPassword.length >= 6 &&
      this.confirmPassword.length >= 6 &&
      this.newPassword === this.confirmPassword &&
      this.currentPassword.length >= 1
    );
  }

  togglePasswordVisibility(): void {
    this.authService.autoLogoutIfExpired();
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.authService.autoLogoutIfExpired();
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleCurrentPasswordVisibility(): void {
    this.authService.autoLogoutIfExpired();
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  onChangePassword() {
    this.authService.autoLogoutIfExpired();
    this.successMessage = null;
    this.errorMessage = null;

    if (!this.adminUser || !this.adminUser.email) {
      this.errorMessage = "❌ Utilisateur introuvable.";
      return;
    }

    if (!this.isFormValid()) {
      this.errorMessage = "❌ Veuillez corriger les erreurs avant de soumettre.";
      return;
    }

    const payload = {
      email: this.adminUser.email,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.userService.changePassword(payload).pipe(take(1)).subscribe({
      next: (response) => {
        this.successMessage = '✅ Mot de passe mis à jour avec succès !';
        this.errorMessage = null;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.successMessage = null;
      
        // Affichage propre du message d'erreur backend
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = '❌ Une erreur est survenue lors du changement de mot de passe.';
        }
      }      
    });
  }
}
