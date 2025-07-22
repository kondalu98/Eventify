import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import {  CommonModule } from '@angular/common'; // Still needed for structural directives

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
    {
      imageSrc: 'assets/slide_1.avif',
      altText: 'A vibrant abstract image'
    },
    {
      imageSrc: 'assets/slide_2.avif',
      altText: 'A serene natural landscape'
    },
    {
      imageSrc: 'assets/slide_1.avif',
      altText: 'Modern architectural design'
    }
  ]);
  

  currentIndex = signal(0);
  autoplayInterval: any;

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  setCurrentSlide(index: number): void {
    this.currentIndex.set(index);
    this.resetAutoplay();
  }

  nextSlide(): void {
    this.currentIndex.update(current => (current + 1) % this.slides().length);
    this.resetAutoplay();
  }

  prevSlide(): void {
    this.currentIndex.update(current => (current - 1 + this.slides().length) % this.slides().length);
    this.resetAutoplay();
  }

  startAutoplay(): void {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  resetAutoplay(): void {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  }
}