import { Routes } from '@angular/router';
import { AdminTicketsComponent } from './admin-tickets/admin-tickets.component';
import { NotificationComponent } from './notification/notification.component';
import { AdminAuthGuard } from './admin-auth.guard';
import { UserAuthGuard } from './user-auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
  { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent) },
  { path: 'admin/dash', loadComponent: () => import('./admin/dashboard.component').then(m => m.DashboardComponent),canActivate: [AdminAuthGuard] },
  { path: 'event/:id', loadComponent: () => import('./event-details/event-details.component').then(m => m.EventDetailComponent) },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),canActivate: [UserAuthGuard] },
  {
    path: 'tickets',
    loadComponent: () => import('./ticket/ticket.component').then(m => m.TicketsComponent),canActivate: [UserAuthGuard]
  },{
    path: 'admin/tickets',
    component: AdminTicketsComponent, canActivate: [AdminAuthGuard]},
    {
      path:'notify',
      component:NotificationComponent,canActivate: [AdminAuthGuard]
    }
];
