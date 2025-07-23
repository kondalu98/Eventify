import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './event-details.component.html',
 
})
export class EventDetailComponent implements OnInit {
  event: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  
  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    console.log(eventId);
    if (eventId) {
      this.http.get(`http://localhost:8082/api/events/${eventId}`)
        .subscribe(data => {
          this.event = data;
        });
    }
  }

  validateTicket() {
    alert('Ticket validated!');
  }
}
