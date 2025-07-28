import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselItem {
  imageSrc: string;
  altText: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
})
export class CarouselComponent implements OnInit, OnDestroy {
  slides = signal<CarouselItem[]>([
    { imageSrc: 'assets/slide_1.avif', altText: 'Slide 1' },
    { imageSrc: 'assets/slide_2.avif', altText: 'Slide 2' },
    { imageSrc: 'assets/slide_3.avif', altText: 'Slide 3' },
  ]);

  currentIndex = signal(0);
  autoplayInterval: any;

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    clearInterval(this.autoplayInterval);
  }

  setCurrentSlide(index: number) {
    this.currentIndex.set(index);
    this.resetAutoplay();
  }

  nextSlide() {
    this.currentIndex.update(i => (i + 1) % this.slides().length);
    this.resetAutoplay();
  }

  prevSlide() {
    this.currentIndex.update(i => (i - 1 + this.slides().length) % this.slides().length);
    this.resetAutoplay();
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  resetAutoplay() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  }
}
