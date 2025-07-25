import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { EventFeedbacksComponent } from '../event-feedbacks/event-feedbacks.component';
import { FeedbackFormComponent } from '../feedback/feedback.component';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FeedbackFormComponent,EventFeedbacksComponent],
  templateUrl: './event-details.component.html',
})
export class EventDetailComponent implements OnInit {
  event: any;
  ticketBooked = false;
  ticketId: number | null = null;
  showFeedbackForm = false;
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.http.get(`http://localhost:8082/api/events/${eventId}`).subscribe((data) => {
        this.event = data;
      });
    }
  }

  validateTicket() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }
  
    const { id: userId, token } = JSON.parse(storedUser);
    const eventId = this.event?.eventID;
    if (!eventId || !userId) return;
  
    const bookingData = { userId, eventId };
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    this.http.post<any>('http://localhost:8082/api/tickets/book', bookingData, { headers }).subscribe({
      next: (response) => {
        this.ticketBooked = true;
        this.ticketId = response.ticketId;
        this.cdr.detectChanges();  // Trigger change detection manually
      },
      error: (err) => {
        console.error('Booking failed', err);
        alert('❌ Booking failed. Please try again.');
      },
    });
  }

  validateRate() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    const { id } = JSON.parse(storedUser);
    this.userId = id;
    this.showFeedbackForm = true;
  }

  goToLocationPage() {
    this.location.back();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
