import { Routes } from '@angular/router';
import { AdminAuthGuard } from './admin-auth.guard';
import { UserAuthGuard } from './user-auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: 'admin/dash',
    loadComponent: () =>
      import('./admin/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'event/:id',
    loadComponent: () =>
      import('./event-details/event-details.component').then(
        (m) => m.EventDetailComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [UserAuthGuard],
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import('./ticket/ticket.component').then((m) => m.TicketsComponent),
    canActivate: [UserAuthGuard],
  },
  {
    path: 'admin/tickets',

    loadComponent: () =>
      import('./admin-tickets/admin-tickets.component').then(
        (m) => m.AdminTicketsComponent
      ),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'notify',
    loadComponent: () =>
      import('./notification/notification.component').then(
        (m) => m.NotificationComponent
      ),
    canActivate: [AdminAuthGuard],
  },
  { path: '**', component: NotFoundComponent }
];
