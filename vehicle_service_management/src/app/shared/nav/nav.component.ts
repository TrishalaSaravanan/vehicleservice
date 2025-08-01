import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this import
import { RouterModule } from '@angular/router'; // Add if using routerLink

@Component({
  selector: 'app-nav',
  standalone: true, // If using standalone components
  imports: [CommonModule, RouterModule], // Add these imports
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
}