import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AboutComponent } from '../../shared/about/about.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeroComponent } from '../../shared/hero/hero.component';
import { NavComponent } from '../../shared/nav/nav.component';
import { ServicesComponent } from '../../shared/services/services.component';
import { ContactComponent } from '../../shared/contact/contact.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AboutComponent,FooterComponent,HeroComponent,NavComponent,ServicesComponent,ContactComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private authService: AuthService) {}
  showToast = false;
  toastError = false;
  toastMessage = '';
  showScrollToTop = false;

  ngOnInit() {
    // Home page is public, no authentication check
    // Add class for main navigation padding
    document.body.classList.add('has-main-nav');
    // Wait for components to load, then setup scroll functionality
    setTimeout(() => {
      this.updateArrowVisibility();
      this.updateScrollToTopVisibility();
    }, 100);
  }

  ngOnDestroy() {
    // Remove class when leaving home page
    document.body.classList.remove('has-main-nav');
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.updateArrowVisibility();
    this.updateScrollToTopVisibility();
  }

  updateScrollToTopVisibility() {
    const scrollPosition = window.scrollY;
    // Show scroll-to-top button when user scrolls down more than 200px
    this.showScrollToTop = scrollPosition > 200;
  }

  updateArrowVisibility() {
    const scrollDownArrow = document.getElementById('scrollDownArrow');
    const scrollUpArrow = document.getElementById('scrollUpArrow');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    
    if (scrollDownArrow && scrollUpArrow) {
      // Show/hide up arrow - show when scrolled past hero section
      if (scrollPosition > windowHeight / 2) {
        scrollUpArrow.style.opacity = '1';
        scrollUpArrow.style.visibility = 'visible';
      } else {
        scrollUpArrow.style.opacity = '0';
        scrollUpArrow.style.visibility = 'hidden';
      }
      
      // Show/hide down arrow - hide when near bottom
      if (scrollPosition + windowHeight < documentHeight - 100) {
        scrollDownArrow.style.opacity = '1';
        scrollDownArrow.style.visibility = 'visible';
      } else {
        scrollDownArrow.style.opacity = '0';
        scrollDownArrow.style.visibility = 'hidden';
      }
    }
  }

  scrollToNextSection() {
    const sections = ['home', 'about', 'services', 'contact'];
    const currentScroll = window.scrollY;
    let nextSectionId: string | null = null;
    
    // Find the current section and get the next one
    for (let i = 0; i < sections.length; i++) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const sectionTop = section.offsetTop - 80; // Account for navbar height
        if (sectionTop > currentScroll + 100) {
          nextSectionId = sections[i];
          break;
        }
      }
    }
    
    if (nextSectionId) {
      const targetSection = document.getElementById(nextSectionId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  scrollToPreviousSection() {
    const sections = ['home', 'about', 'services', 'contact'];
    const currentScroll = window.scrollY;
    let prevSectionId: string | null = null;
    
    // Find the current section and get the previous one
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const sectionTop = section.offsetTop - 80; // Account for navbar height
        if (sectionTop < currentScroll - 100) {
          prevSectionId = sections[i];
          break;
        }
      }
    }
    
    if (prevSectionId) {
      const targetSection = document.getElementById(prevSectionId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Scroll to top if no previous section found
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  scrollToTop() {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
    // Hide the button immediately after clicking (optional)
    // this.showScrollToTop = false;
  }

  showToastMessage(message: string, isError: boolean = false) {
    this.toastMessage = message;
    this.toastError = isError;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}