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
    console.log('Submitting feedback...');
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const { token } = JSON.parse(storedUser);
    const { rating, comment } = this.feedbackForm.value;

    const url = `http://localhost:8082/api/feedback?userId=${this.userId}&eventId=${this.eventId}&rating=${rating}&comments=${encodeURIComponent(
      comment
    )}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post(url, null, { headers }).subscribe({
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
