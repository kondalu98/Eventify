import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

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
  rating: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.feedbackForm = this.fb.group({
      rating: [null, Validators.required],
      comment: ['', [Validators.required]],
    });
  }

  setRating(value: number) {
    this.rating = value;
    const ratingControl = this.feedbackForm.get('rating');
    ratingControl?.setValue(value);
    ratingControl?.markAsTouched();
    ratingControl?.updateValueAndValidity();
  }

  submitFeedback() {
    if (this.feedbackForm.invalid || this.rating === 0) {
      alert("Please provide a valid rating and comment.");
      return;
    }

    const storedUser = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    if (!storedUser || !token) {
      alert("User not logged in or token missing.");
      return;
    }

    const { id: userId } = JSON.parse(storedUser);
    const { comment } = this.feedbackForm.value;

    const url = `http://localhost:8082/api/feedback?userId=${userId}&eventId=${this.eventId}&rating=${this.rating}&comments=${encodeURIComponent(comment)}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.http.post(url, null, { headers }).subscribe({
      next: () => {
        alert('Feedback submitted!');
        this.feedbackForm.reset();
        this.rating = 0;
        this.feedbackSubmitted.emit();
      },
      error: (err) => {
        console.error('Feedback submission failed:', err);
        alert(`Feedback submission failed:', ${err.message}`);
      },
    });
  }
}
