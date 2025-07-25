import { Component, Input, OnInit, Pipe } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-feedbacks',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './event-feedbacks.component.html',
})
export class EventFeedbacksComponent implements OnInit {
  @Input() eventId!: number;

  feedbacks: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.eventId) {
      this.loadFeedbacks();
    }
  }

  loadFeedbacks() {
    this.loading = true;
    this.http.get<any[]>(`http://localhost:8082/api/feedback/event/${this.eventId}`).subscribe({
      next: (data) => {
        // Sort by timestamp (most recent first), then take top 3
        this.feedbacks = data
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load feedbacks.';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
}
