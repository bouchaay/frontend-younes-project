import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, TranslateModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['expired']) {
        this.errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
      }
    });
  }
  

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const { email, phone } = this.loginForm.value;

    this.authService.login(email, phone).subscribe({
      next: () => {
        this.loading = false;
        const user = this.authService.getUser();

        if (!user) {
          this.errorMessage = 'Erreur de connexion, utilisateur introuvable.';
          return;
        }

        // 🔹 Redirection selon le rôle
        switch (user.role) {
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          case 'employee':
            this.router.navigate(['/employee']);
            break;
          default:
            this.router.navigate(['/client']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
