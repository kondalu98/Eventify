import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  notifications: any[] = [];
  isNotificationDropdownOpen = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
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






  // Notifications
  toggleNotificationDropdown() {
  this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;

  if (this.isNotificationDropdownOpen && this.user?.id) {
    this.fetchNotifications(this.user.id);

    // Clear notifications after showing (simulate read)
    setTimeout(() => {
      this.notifications = [];
    }, 3000); // Adjust if needed
  }
}

  fetchNotifications(id?: any): void {
    const user = this.authService.getUser(); // Get user from service
    const token = user?.token;

    if (!token) {
      console.warn('No token found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any[]>(`http://localhost:8082/api/notifications/alerts/${user.id}`, {
        headers,
      })
      .subscribe({
        next: (data) => {
          this.notifications = data;
          console.log('Notifications:', data);
        },
        error: (error) => {
          console.error('Failed to load notifications', error);
        },
      });
  }
}


