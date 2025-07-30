import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AuthAdminService } from '../auth.admin.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
  userId: number = 0;
  eventId: number = 0;
  message: string = '';
  users: any[] = [];
  events: any[] = [];

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  private baseUrl = 'http://localhost:8082/api';

  constructor(
    private http: HttpClient,
    private location: Location,
    private authService: AuthAdminService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEvents();
  }

  loadUsers(): void {
    this.http.get(`${this.baseUrl}/users/all`).subscribe({
      next: (data: any) => (this.users = data),
      error: (err) => console.error('Error fetching users', err),
    });
  }

  loadEvents(): void {
    this.http.get(`${this.baseUrl}/events`).subscribe({
      next: (data: any) => (this.events = data),
      error: (err) => console.error('Error fetching events', err),
    });
  }

  goBack(): void {
    this.location.back();
  }

  sendNotification(): void {
    if (!this.authService.isLoggedIn()) {
      this.setNotification('Unauthorized: Admin login required', 'error');
      return;
    }

    if (!this.eventId || !this.message.trim()) {
      this.setNotification('Event and message are required!', 'error');
      return;
    }

    const headers = this.authService.getAuthHeaders();

    const url =
      this.userId === 0
        ? `${this.baseUrl}/notifications/broadcast?eventId=${this.eventId}&message=${encodeURIComponent(this.message)}`
        : `${this.baseUrl}/notifications/notification?userId=${this.userId}&eventId=${this.eventId}&message=${encodeURIComponent(this.message)}`;

    this.http.post(url, {}, { headers }).subscribe({
      next: () => {
        this.setNotification('✅ Notification sent successfully!', 'success');
        this.message = '';
        this.userId = 0;
        this.eventId = 0;
      },
      error: (error) => {
        console.error('Error sending notification', error);
        this.setNotification('❌ Failed to send notification.', 'error');
      },
    });
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3000);
  }
}
