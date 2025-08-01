import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-card.component.html',
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  selectedDate: string = '';
  selectedLocation: string = '';
  availableLocations: string[] = []; // Dropdown values
  imageUrls: string[] = ['assets/ev_1.webp', 'assets/ev_2.jpg', 'assets/ev_3.jpg'];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchLocations();
    this.loadEvents(); // Load all events initially or based on navbar location param
  }

  // Get all unique locations from backend or hardcoded
  fetchLocations() {
    this.http.get<any[]>('http://localhost:8082/api/events').subscribe({
      next: (events) => {
        const allLocations = events.map(event => event.location);
        this.availableLocations = [...new Set(allLocations)]; // unique values only
      },
      error: () => {
        // fallback static locations
        this.availableLocations = ['hyd', 'delhi', 'bangalore'];
      }
    });
  }
  

  loadEvents(date?: string, location?: string) {
    let url = 'http://localhost:8082/api/events';

    if (date && location) {
      url = `http://localhost:8082/api/events/filter?date=${date}&location=${location}`;
    } else if (date) {
      url = `http://localhost:8082/api/events/date?date=${date}`;
    } else if (location) {
      url = `http://localhost:8082/api/events/location?location=${location}`;
    }

    this.http.get<any[]>(url).subscribe({
      next: (events) => {
        if (!events || events.length === 0) {
          this.events = [];
          return;
        }

        const eventsWithImages = this.assignImages(events);
        this.loadRatings(eventsWithImages);
      },
      error: (err) => {
        this.events = [];
        console.error('Error loading events', err);
      },
    });
  }

  assignImages(events: any[]) {
    return events.map((event, index) => ({
      ...event,
      imageUrl: event.imageUrl || this.imageUrls[index % this.imageUrls.length],
    }));
  }

  loadRatings(events: any[]) {
    const ratingRequests = events.map(event =>
      this.http.get<number>(`http://localhost:8082/api/feedback/event-rating/${event.eventID}`)
    );

    forkJoin(ratingRequests).subscribe(ratings => {
      this.events = events.map((event, index) => ({
        ...event,
        rating: ratings[index] ?? 0
      }));
    });
  }

  onDateChange() {
    this.loadEvents(this.selectedDate, this.selectedLocation);
  }

  onLocationChange() {
    this.loadEvents(this.selectedDate, this.selectedLocation);
  }

  resetFilters() {
    this.selectedDate = '';
    this.selectedLocation = '';
    this.loadEvents();
  }

  goToEventDetail(event: any) {
    this.router.navigate(['/event', event.eventID]);
  }
}
