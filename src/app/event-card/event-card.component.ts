import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone:true,
  imports:[CommonModule],
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

  // assignImages(events: any[]) {
  //   return events.map((event, index) => ({
  //     ...event,
  //     imageUrl: this.imageUrls[index % this.imageUrls.length]
  //   }));
  // }

  assignImages(events: any[]) {
    return events.map((event, index) => ({
      ...event,
      imageUrl: event.imageUrl || this.imageUrls[index % this.imageUrls.length]
    }));
  }
  goToEventDetail(event: any) {
   
    this.router.navigate(['/event', event.eventID]);
  }
  
  
  
}



