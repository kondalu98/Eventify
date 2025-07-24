import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  templateUrl: './admin-tickets.component.html',
  imports: [FormsModule, CommonModule]
})
export class AdminTicketsComponent implements OnInit {
  tickets: any[] = [];
  token: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private location: Location) {}

  ngOnInit(): void {
    const token = localStorage.getItem('admin-token');
    if (token) {
      this.token = token;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

      this.http.get<any[]>('http://localhost:8082/api/tickets', { headers }).subscribe({
        next: (data) => this.tickets = data,
        error: () => this.errorMessage = 'Failed to fetch tickets.'
      });
    } else {
      this.errorMessage = 'Unauthorized access.';
    }
  }

  cancelTicket(ticketId: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.patch(`http://localhost:8082/api/tickets/${ticketId}/cancel`, {}, { headers }).subscribe({
      next: () => {
        const ticket = this.tickets.find(t => t.ticketId === ticketId);
        if (ticket) ticket.status = 'CANCELED';
      },
      error: () => this.errorMessage = 'Failed to cancel ticket.'
    });
  }

  goBack() {
    this.location.back();
  }
}
