import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './event-card.component.html',
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  imageUrls: string[] = [
    'assets/ev_1.webp',
    'assets/ev_2.jpg',
    'assets/ev_3.jpg',
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadAllEvents();
  }

  loadAllEvents() {
    this.http.get<any[]>('http://localhost:8082/api/events').subscribe(events => {
      const eventsWithImages = this.assignImages(events);

      // Now fetch ratings for each event
      const ratingRequests = eventsWithImages.map(event =>
        this.http.get<number>(`http://localhost:8082/api/feedback/event-rating/${event.eventID}`)
      );

      // Wait for all rating requests to complete
      forkJoin(ratingRequests).subscribe(ratings => {
        // Merge ratings into events
        this.events = eventsWithImages.map((event, index) => ({
          ...event,
          rating: ratings[index] ?? 0
        }));
      });
    });
  }

  loadEventsByLocation(location: string) {
    if (!location.trim()) {
      this.loadAllEvents();
      return;
    }

    this.http.get<any[]>(`http://localhost:8082/api/events/location?location=${location}`)
      .subscribe(events => {
        const eventsWithImages = this.assignImages(events);

        const ratingRequests = eventsWithImages.map(event =>
          this.http.get<number>(`http://localhost:8082/api/feedback/event-rating/${event.eventID}`)
        );

        forkJoin(ratingRequests).subscribe(ratings => {
          this.events = eventsWithImages.map((event, index) => ({
            ...event,
            rating: ratings[index] ?? 0
          }));
        });
      });
  }

  assignImages(events: any[]) {
    return events.map((event, index) => ({
      ...event,
      imageUrl: event.imageUrl || this.imageUrls[index % this.imageUrls.length]
    }));
  }

  goToEventDetail(event: any) {
    this.router.navigate(['/event', event.eventID]);
  }
  selectedDate: string = '';

  onDateChange() {
    if (!this.selectedDate) {
      this.loadAllEvents(); // Reset
      return;
    }
  
    this.http.get<any[]>(`http://localhost:8082/api/events/date?date=${this.selectedDate}`)
      .subscribe(events => {
        if (!events || events.length === 0) {
          this.events = [];
          return;
        }
  
        const eventsWithImages = this.assignImages(events);
        const ratingRequests = eventsWithImages.map(event =>
          this.http.get<number>(`http://localhost:8082/api/feedback/event-rating/${event.eventID}`)
        );
  
        forkJoin(ratingRequests).subscribe(ratings => {
          this.events = eventsWithImages.map((event, index) => ({
            ...event,
            rating: ratings[index] ?? 0
          }));
        });
      }, error => {
        console.error('Error fetching events for date:', error);
        this.events = [];
      });
  }
  
  resetFilters() {
    this.loadAllEvents();
  }
  
  
}
