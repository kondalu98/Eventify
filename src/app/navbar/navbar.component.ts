import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports:[CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  @Output() locationSelected = new EventEmitter<string>();
  isMobileMenuOpen = false;
  selectedLocation = '';
  locations: string[] = [];

  constructor(private router: Router,private http:HttpClient) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

   ngOnInit(): void {
    // Load all locations from /api/events
    this.http.get<any[]>('http://localhost:8082/api/events')
      .subscribe(events => {
        // Extract unique locations from events
        const allLocations = events.map(e => e.location);
        this.locations = Array.from(new Set(allLocations)); // Unique locations
      });
  }
  onLocationChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLocation = select.value;
    this.locationSelected.emit(this.selectedLocation);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }
}


