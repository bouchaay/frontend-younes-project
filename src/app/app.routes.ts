import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { TeamComponent } from './pages/team/team.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { AuthGuard } from './guards/auth.guard';

// ADMIN
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AdminAppointmentsComponent } from './pages/admin/admin-appointments/admin-appointments.component';
import { AdminChangePasswordComponent } from './pages/admin/admin-change-password/admin-change-password.component';

// EMPLOYEE
import { EmployeeLayoutComponent } from './pages/employee/employee-layout/employee-layout.component';
import { EmployeeDashboardComponent } from './pages/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeChangePasswordComponent } from './pages/employee/employee-change-password/employee-change-password.component';

// CLIENT
import { ClientDashboardComponent } from './pages/client/client-dashboard/client-dashboard.component';
import { ClientChangePasswordComponent } from './pages/client/client-change-password/client-change-password.component';
import { ClientLayoutComponent } from './pages/client/client-layout/client-layout.component';
import { EmployeeDisponibilitesComponent } from './pages/employee/employee-disponibilites/employee-disponibilites.component';
import { AboutComponent } from './pages/about/about.component';
import { ClientProfileComponent } from './pages/client/client-profile/client-profile.component';
import { MentionLegalComponent } from './components/mention-legal/mention-legal.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { animation: 'HomePage' } },
  { path: 'services', component: ServicesComponent, data: { animation: 'ServicesPage' } },
  { path: 'team', component: TeamComponent, data: { animation: 'TeamPage' } },
  { path: 'contact', component: ContactComponent, data: { animation: 'ContactPage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'RegisterPage' } },
  { path: 'about', component: AboutComponent, data: { animation: 'AboutPage' } },
  {path: 'mentions-legales', component: MentionLegalComponent, data: { animation: 'MentionLegalPage' }},
  

  // ADMIN
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin', animation: 'AdminPage' },
    children: [
      { path: 'users', component: AdminUsersComponent, data: { animation: 'AdminUsers' } },
      { path: 'appointments', component: AdminAppointmentsComponent, data: { animation: 'AdminAppointments' } },
      { path: 'change-password', component: AdminChangePasswordComponent, data: { animation: 'AdminChangePassword' } },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },

  // EMPLOYEE
  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'employee', animation: 'EmployeePage' },
    children: [
      { path: 'dashboard', component: EmployeeDashboardComponent, data: { animation: 'EmployeeDashboard' } },
      { path: 'change-password', component: EmployeeChangePasswordComponent, data: { animation: 'EmployeeChangePassword' } },
      { path: 'disponibilite', component: EmployeeDisponibilitesComponent, data: { animation: 'EmployeeDispos' } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // CLIENT
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'client', animation: 'ClientPage' },
    children: [
      { path: 'dashboard', component: ClientDashboardComponent, data: { animation: 'ClientDashboard' } },
      { path: 'change-password', component: ClientChangePasswordComponent, data: { animation: 'ClientChangePassword' } },
      { path: 'profile', component: ClientProfileComponent, data: { animation: 'ClientProfile' } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
