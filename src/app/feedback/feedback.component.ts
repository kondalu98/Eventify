import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feedback.component.html',
})
export class FeedbackFormComponent {
  @Input() eventId!: number;
  @Input() userId!: number;
  @Output() feedbackSubmitted = new EventEmitter<void>();

  feedbackForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.feedbackForm = this.fb.group({
      rating: [null, [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  submitFeedback() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const { token } = JSON.parse(storedUser);
    const url = `http://localhost:8082/api/feedback?userId=${this.userId}&eventId=${this.eventId}&rating=${this.feedbackForm.value.rating}&comments=${encodeURIComponent(this.feedbackForm.value.comment)}`;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(url, { headers }).subscribe({
      next: () => {
        alert('✅ Feedback submitted!');
        this.feedbackForm.reset();
        this.feedbackSubmitted.emit();
      },
      error: (err) => {
        console.error('❌ Feedback error:', err);
        alert('❌ Feedback submission failed.');
      },
    });
  }
}
