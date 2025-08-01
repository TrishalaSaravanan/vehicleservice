import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-800">Reports</h2>
          <p class="text-gray-600">View analytics and generate reports</p>
        </div>
        <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
          Generate Report
        </button>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6">
        <p class="text-gray-600">Reports and analytics functionality will be implemented here.</p>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-green-800">Revenue</h3>
            <p class="text-2xl font-bold text-green-600">₹2,45,000</p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold text-blue-800">Services</h3>
            <p class="text-2xl font-bold text-blue-600">156</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold text-yellow-800">Avg Rating</h3>
            <p class="text-2xl font-bold text-yellow-600">4.8</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold text-purple-800">Growth</h3>
            <p class="text-2xl font-bold text-purple-600">+15%</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #1B4B88;
      --primary-dark: #0D3A6E;
    }
  `]
})
export class ReportsComponent {}
