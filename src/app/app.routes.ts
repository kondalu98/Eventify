import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard.component';
import { EventDetailComponent } from './event-details/event-details.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', component:LoginComponent },
  { path: 'register', component:RegisterComponent },
  { path: 'admin', component:AdminComponent },
  { path: 'admin/dash', component:DashboardComponent },
  { path: 'event/:id', component: EventDetailComponent },
  {path:'profile',component:ProfileComponent}

];
