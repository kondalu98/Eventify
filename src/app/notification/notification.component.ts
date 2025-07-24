import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit {
  userId: number = 0;
  eventId: number = 0;
  message: string = '';

  users: any[] = [];
  events: any[] = [];

  private baseUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEvents();
  }

  loadUsers() {
    this.http.get(`${this.baseUrl}/users/all`).subscribe({
      next: (data: any) => (this.users = data),
      error: (err) => console.error('Error fetching users', err)
    });
  }

  loadEvents() {
    this.http.get(`${this.baseUrl}/events`).subscribe({
      next: (data: any) => (this.events = data),
      error: (err) => console.error('Error fetching events', err)
    });
  }

  sendNotification() {
    const token = localStorage.getItem('admin-token');

    if (!token) {
      alert('Unauthorized: Admin login required');
      return;
    }

    if (!this.userId || !this.eventId || !this.message.trim()) {
      alert('All fields are required!');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.baseUrl}/notifications/notification?userId=${this.userId}&eventId=${this.eventId}&message=${encodeURIComponent(this.message)}`;

    this.http.post(url, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Notification sent:', response);
        alert('Notification sent successfully!');
        this.message = ''; // clear message
      },
      error: (error) => {
        console.error('Error sending notification', error);
        alert('Failed to send notification.');
      }
    });
  }
}
