import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  showPassword = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatch }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const { firstName, lastName, email, phone, password } =
      this.registerForm.value;

    const newClient: User = {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      password,
      role: 'client',
      status: 'actif',
      createdAt: new Date(),
      completedAppointments: 0,
      canceledAppointments: 0,
    };

    this.authService.register(newClient).subscribe({
      next: () => {
        this.loading = false;
        alert(
          '✅ Inscription réussie ! Vous pouvez maintenant vous connecter.'
        );
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Erreur API :', err);
        this.errorMessage =
          err?.error?.message ||
          '❌ Erreur lors de l’inscription, veuillez réessayer.';
        alert(
          "L'email ou le numéro de téléphone est déjà utilisé. Veuillez vous connecter ou réessayer avec un autre email ou numéro de téléphone."
        );
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
