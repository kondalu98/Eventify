import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-events',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './event-card.component.html',
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  imageUrls: string[] = [
    'assets/event_1.jpg',
    'assets/event_2.jpg',
    'assets/event_3.jpg',
    'assets/event_1.jpg'

  ];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAllEvents();
  }

  loadAllEvents() {
    this.http.get<any[]>('http://localhost:8082/api/events')
      .subscribe(data => {
        this.events = this.assignImages(data);
      });
  }

  loadEventsByLocation(location: string) {
    if (!location.trim()) {
      this.loadAllEvents();
      return;
    }

    this.http.get<any[]>(`http://localhost:8082/api/events/location?location=${location}`)
      .subscribe(data => {
        this.events = this.assignImages(data);
      });
  }

  assignImages(events: any[]) {
    return events.map((event, index) => ({
      ...event,
      imageUrl: this.imageUrls[index % this.imageUrls.length]
    }));
  }
}



