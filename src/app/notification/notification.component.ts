import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
  userId: number = 0; // 0 means all users
  eventId: number = 0;
  message: string = '';

  users: any[] = [];
  events: any[] = [];

  private baseUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private location: Location) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEvents();
  }

  loadUsers() {
    this.http.get(`${this.baseUrl}/users/all`).subscribe({
      next: (data: any) => (this.users = data),
      error: (err) => console.error('Error fetching users', err),
    });
  }

  loadEvents() {
    this.http.get(`${this.baseUrl}/events`).subscribe({
      next: (data: any) => (this.events = data),
      error: (err) => console.error('Error fetching events', err),
    });
  }

  goBack() {
    this.location.back(); // back to previous route
  }

  sendNotification() {
    const token = localStorage.getItem('admin-token');

    if (!token) {
      alert('Unauthorized: Admin login required');
      return;
    }

    if (!this.eventId || !this.message.trim()) {
      alert('Event and message are required!');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url =
      this.userId === 0
        ? `${this.baseUrl}/notifications/broadcast?eventId=${this.eventId}&message=${encodeURIComponent(this.message)}`
        : `${this.baseUrl}/notifications/notification?userId=${this.userId}&eventId=${this.eventId}&message=${encodeURIComponent(this.message)}`;

    this.http.post(url, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Notification sent:', response);
        alert('Notification sent successfully!');
        this.message = '';
        this.userId = 0;
        this.eventId = 0;
      },
      error: (error) => {
        console.error('Error sending notification', error);
        alert('Failed to send notification.');
      },
    });
  }
}
