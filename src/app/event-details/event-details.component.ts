import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { EventFeedbacksComponent } from '../event-feedbacks/event-feedbacks.component';
import { FeedbackFormComponent } from '../feedback/feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FeedbackFormComponent, EventFeedbacksComponent],
  templateUrl: './event-details.component.html',
})
export class EventDetailComponent implements OnInit {
  event: any;
  ticketBooked = false;
  ticketId: number | null = null;
  showFeedbackForm = false;
  showTicketConfirmation = false;

  userId: number | null = null;
  username: string = '';
  

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private authService:AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.http.get(`http://localhost:8082/api/events/${eventId}`).subscribe((data) => {
        this.event = data;
      });
    }

    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      this.userId = parsed.id;
      this.username = parsed.name || 'Guest';
    }
  }
  handleBookClick() {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
    } else {
      this.showTicketConfirmation = true;
    }
  }
  



  validateTicket() {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      alert('You must be logged in to book a ticket.');
      this.router.navigate(['/login']);
      return;
    }
  
    const { id: userId } = JSON.parse(storedUser);
    const token = this.authService.getToken(); 
  
    const eventId = this.event?.eventID;
    if (!eventId || !userId || !token) {
      alert('Invalid booking details.');
      return;
    }
  
    const bookingData = { userId, eventId };
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    console.log('Booking Data:', bookingData);
    console.log('Auth Header:', headers.get('Authorization'));
  
    this.http.post<any>('http://localhost:8082/api/tickets/book', bookingData, { headers }).subscribe({
      next: (response) => {
        this.ticketBooked = true;
        this.ticketId = response.ticketId;
        this.showTicketConfirmation = false;
        this.cdr.detectChanges();
        alert('Ticket booked successfully!');
      },
      error: (err) => {
        console.error('Booking failed:', err);
        if (err.status === 401) {
          alert('Unauthorized. Please log in again.');
          this.router.navigate(['/login']);
        } else {
          alert('Booking failed. Please try again later.');
        }
      },
    });
  }
  

  validateRate() {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']); 
      return;
    }
  
    const { id: userId } = JSON.parse(storedUser);
    this.userId = userId;
    this.showFeedbackForm = true; 
  }
  

  goToLocationPage() {
    this.location.back();
  }
}