import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket.component.html',
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  errorMessage = '';
  token!: string;
  userId!: number;

  constructor(private http: HttpClient, private router: Router,private location: Location) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(storedUser);
    this.userId = user.id;
    this.token = user.token;

    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    this.http.get<any[]>(`http://localhost:8082/api/tickets/user/${this.userId}`, { headers }).subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (err) => {
        console.error('Failed to load tickets:', err);
        this.errorMessage = err.error?.message || 'Failed to load your tickets.';
      },
    });
  }

  cancelTicket(ticketId: number): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    this.http.patch(`http://localhost:8082/api/tickets/${ticketId}/cancel`, {}, { headers }).subscribe({
      next: () => {
        const ticket = this.tickets.find((t) => t.ticketId === ticketId);
        if (ticket) ticket.status = 'CANCELED';
      },
      error: (err) => {
        console.error('Cancel failed:', err);
        this.errorMessage = err.error?.message || 'Failed to cancel the ticket.';
      },
    });
  }

  goBack(): void {
    this.location.back(); // Or home page
  }
}
