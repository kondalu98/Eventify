import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { CarouselComponent } from './carousel/carousel.component';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './event-card/event-card.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ,CarouselComponent,NavbarComponent,CommonModule,EventsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eventify';
  isHomeRoute = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const homeRoutes = ['/', '/home'];  // Update this list as needed
        this.isHomeRoute = homeRoutes.includes(event.urlAfterRedirects);
      });
  }
  @ViewChild('eventList') eventList!: EventsComponent;

  onLocationSelected(location: string) {
    this.eventList.loadEventsByLocation(location);
  }
 
  

  

}
