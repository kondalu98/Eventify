import { Component, OnInit } from '@angular/core';

import { AuthAdminService } from '../auth.admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  templateUrl: './admin-tickets.component.html',
  imports: [FormsModule, CommonModule],
})
export class AdminTicketsComponent implements OnInit {
  tickets: any[] = [];
  errorMessage: string = '';

  
  constructor(
    private http: HttpClient,
    private location: Location,
    private authService: AuthAdminService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const headers = this.authService.getAuthHeaders();

      this.http.get<any[]>('http://localhost:8082/api/tickets', { headers }).subscribe({
        next: (data) => (this.tickets = data),
        error: () => (this.errorMessage = 'Failed to fetch tickets.'),
      });
    } else {
      this.errorMessage = 'Unauthorized access.';
    }
  }

  cancelTicket(ticketId: number): void {
    const headers = this.authService.getAuthHeaders();

    this.http
      .patch(`http://localhost:8082/api/tickets/${ticketId}/cancel`, {}, { headers })
      .subscribe({
        next: () => {
          const ticket = this.tickets.find((t) => t.ticketId === ticketId);
          if (ticket) ticket.status = 'CANCELED';
        },
        error: () => (this.errorMessage = 'Failed to cancel ticket.'),
      });
  }

  goBack(): void {
    this.location.back();
  }
}
