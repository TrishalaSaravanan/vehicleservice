import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { ChartsComponent } from '../charts/charts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderComponent,
    StatsCardsComponent,
    ChartsComponent
  ],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Header -->
      <app-header></app-header>

      <!-- Dashboard Content -->
      <div class="p-4 sm:p-6 lg:p-8 space-y-6">
        
        <!-- Stats Cards -->
        <div class="animate-fade-in">
          <app-stats-cards></app-stats-cards>
        </div>

        <!-- Charts Section -->
        <div class="animate-fade-in-delay">
          <app-charts></app-charts>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInDelay {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.6s ease-out;
    }

    .animate-fade-in-delay {
      animation: fadeInDelay 0.8s ease-out;
    }

    :host {
      --primary: #1B4B88;
      --secondary: #2D9CDB;
      --accent: #F2C94C;
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .p-4 {
        padding: 1rem;
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .sm\\:p-6 {
        padding: 1.5rem;
      }
    }

    @media (min-width: 1025px) {
      .lg\\:p-8 {
        padding: 2rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Dashboard initialization logic if needed
  }

}
