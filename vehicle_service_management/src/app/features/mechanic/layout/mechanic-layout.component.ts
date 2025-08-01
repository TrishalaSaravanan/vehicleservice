import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MechanicSidebarComponent } from '../mechanic-sidebar/mechanic-sidebar.component';

@Component({
  selector: 'app-mechanic-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MechanicSidebarComponent],
  template: `
    <div class="flex bg-gray-50 min-h-screen font-sans">
      <app-mechanic-sidebar></app-mechanic-sidebar>
      <main class="flex-1 ml-64 p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class MechanicLayoutComponent {}
