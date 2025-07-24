import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  imports: [FormsModule,CommonModule]
})
export class DashboardComponent implements OnInit {
  events: Event[] = [];

  newEvent: Event = {
    name: '',
    category: '',
    location: '',
    date: '',
    organizerID: ''
  };

  editingEvent: Event | null = null;

  constructor(private http: HttpClient ,private router:Router) {}

  ngOnInit(): void {
    this.fetchEvents(); // only GET does not require token
  }

  // ✅ Public GET - No token needed
  fetchEvents(): void {
    this.http.get<Event[]>('http://localhost:8082/api/events').subscribe({
      next: (data) => (this.events = data),
      error: (err) => console.error('Error fetching events:', err)
    });
  }

  // ✅ Secured POST - Add Event
  addEvent(): void {
    const headers = this.getAuthHeaders();
    this.http.post<Event>('http://localhost:8082/api/events/event', this.newEvent, { headers }).subscribe({
      next: (data) => {
        this.events.push(data);
        this.newEvent = { name: '', category: '', location: '', date: '', organizerID: '' };
      },
      error: (err) => console.error('Error adding event:', err)
    });
  }

  // ✅ Secured PUT - Update Event
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
        error: (err) => console.error('Error updating event:', err)
      });
  }

  deleteEvent(eventID: number): void {
    const headers = this.getAuthHeaders();
    const url = `http://localhost:8082/api/events/event/${eventID}`;
  
    this.http.delete(url, { headers, responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Deleted event successfully:', response);
        this.events = this.events.filter(e => Number(e.eventID) !== Number(eventID));
        this.events = [...this.events]; // force change detection
      },
      error: (err) => {
        console.error('Error deleting event:', err);
      }
    });
  }
  
  

  // Helper to start editing
  startEdit(event: Event): void {
    this.editingEvent = { ...event };
  }

  // Helper to cancel editing
  cancelEdit(): void {
    this.editingEvent = null;
  }

  // ✅ Get auth headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin-token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  logout()
  {
    this.router.navigate(['/admin']); 
    localStorage.removeItem('admin-token');
  }
  onClick()
  {
    this.router.navigate(['admin/tickets'])
  }
  notify()
  {
    this.router.navigate(['/notify'])
  }
}
