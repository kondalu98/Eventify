import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AuthService } from '../auth.service'; // 👈 import service
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<string>();

  isMobileMenuOpen = false;
  selectedLocation = '';
  locations: string[] = [];

  searchQuery = '';
  searchResults: any[] = [];
  allEvents: any[] = [];

  user: any = null;


  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService // 👈 inject
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => this.user = user);

    this.http.get<any[]>('http://localhost:8082/api/events').subscribe(events => {
      this.allEvents = events;
      const allLocations = events.map(e => e.location);
      this.locations = Array.from(new Set(allLocations));
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onLocationChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLocation = select.value;
    this.locationSelected.emit(this.selectedLocation);
  }

  onSearchChange() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query.length === 0) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.allEvents.filter(event =>
      event.name.toLowerCase().includes(query) || event.location.toLowerCase().includes(query)
    );
  }

  goToEventDetail(event: any) {
    this.router.navigate(['/event', event.eventID]);
    this.searchQuery = '';
    this.searchResults = [];
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
