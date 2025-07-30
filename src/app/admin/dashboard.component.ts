import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Event {
  eventID?: number;
  name: string;
  category: string;
  location: string;
  date: string;
  organizerID: string;
}

@Component({
  selector: 'app-add-event',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [FormsModule, CommonModule],
})
export class DashboardComponent implements OnInit {
  events: Event[] = [];
  editingEvent: Event | null = null;
  newEvent: Event = {
    name: '',
    category: '',
    location: '',
    date: '',
    organizerID: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.http.get<Event[]>('http://localhost:8082/api/events').subscribe({
      next: (data) => (this.events = data),
      error: (err) => console.error('Error fetching events:', err),
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin-token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  addEvent(): void {
    const headers = this.getAuthHeaders();
    this.http
      .post<Event>('http://localhost:8082/api/events/event', this.newEvent, {
        headers,
      })
      .subscribe({
        next: (data) => {
          this.events.push(data);
          this.newEvent = {
            name: '',
            category: '',
            location: '',
            date: '',
            organizerID: '',
          };
        },
        error: (err) => console.error('Error adding event:', err),
      });
  }

  startEdit(event: Event): void {
    this.editingEvent = { ...event };
  }

  cancelEdit(): void {
    this.editingEvent = null;
  }

  updateEvent(): void {
    if (!this.editingEvent || !this.editingEvent.eventID) return;
    const headers = this.getAuthHeaders();
    this.http
      .put<Event>(
        `http://localhost:8082/api/events/event/${this.editingEvent.eventID}`,
        this.editingEvent,
        { headers }
      )
      .subscribe({
        next: (updatedEvent) => {
          this.events = this.events.map((e) =>
            e.eventID === updatedEvent.eventID ? updatedEvent : e
          );
          this.editingEvent = null;
        },
        error: (err) => console.error('Error updating event:', err),
      });
  }

  deleteEvent(eventID: number): void {
    const headers = this.getAuthHeaders();
    const url = `http://localhost:8082/api/events/event/${eventID}`;

    this.http.delete(url, { headers, responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Deleted event successfully:', response);
        this.events = this.events.filter(
          (e) => Number(e.eventID) !== Number(eventID)
        );
        this.events = [...this.events];
      },
      error: (err) => {
        console.error('Error deleting event:', err);
      },
    });
  }


  logout() {
    this.router.navigate(['/admin']);
    localStorage.removeItem('admin-token');
  }
  onClick() {
    this.router.navigate(['admin/tickets']);
  }
  notify() {
    this.router.navigate(['/notify']);
  }
}
