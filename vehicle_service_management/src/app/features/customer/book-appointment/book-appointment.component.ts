


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgFor, NgIf, DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../services/vehicle.service';
import { AuthService } from '../../../services/auth.service';

import { ServiceService, Service } from '../../../services/service.service';
import { AppointmentService } from '../../../services/appointment.service';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, NgClass, FormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  // Helper to convert date and time to MySQL DATETIME format
  toMySQLDateTime(date: string, time: string): string {
    // date: '2025-07-31', time: '10:00 AM'
    const [hourMin, ampm] = time.split(' ');
    let [hour, min] = hourMin.split(':').map(Number);
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return `${date} ${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;
  }
  get selectedServices() {
    return this.services.filter((s: any) => s.selected);
  }
  getTotalDuration() {
    // Parse durations and sum in minutes
    const selected = this.services.filter((s: any) => s.selected);
    let totalMinutes = 0;
    for (const s of selected) {
      if (s.duration) {
        const match = s.duration.match(/(\d+(?:\.\d+)?)\s*(hour|hours|hr|h|min|minutes|m)/i);
        if (match) {
          const value = parseFloat(match[1]);
          const unit = match[2].toLowerCase();
          if (unit.startsWith('h')) totalMinutes += value * 60;
          else totalMinutes += value;
        }
      }
    }
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const mins = Math.round(totalMinutes % 60);
      return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
    }
    return `${Math.round(totalMinutes)} min`;
  }
  errorMessage: string = '';
  step = 1;
  showAddVehicle = false;
  showProcessing = false;
  showSuccess = false;

  // Field for customer service notes
  serviceNotes: string = '';

  vehicles: any[] = [];
  selectedVehicle: any = null;
  newVehicle = { make: '', model: '', year: 2024, licensePlate: '', mileage: 0, vin: '' };

  services: any[] = [];

  appointmentDate: string = '';
  appointmentTime: string = '';
  minDate: string = '';
  timeSlots: string[] = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private authService: AuthService,
    private serviceService: ServiceService,
    private appointmentService: AppointmentService
  ) {
    // Set min date to tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
  }

  async ngOnInit() {
    // Ensure customer profile is loaded before fetching vehicles
    if (!this.authService.getCustomerId()) {
      await this.authService.loadCustomerProfile();
    }
    this.fetchVehicles();
    this.fetchServices();
  }

  fetchServices() {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        // Add 'selected' property for UI selection logic
        this.services = (services || []).map(s => ({ ...s, selected: false }));
      },
      error: (err) => {
        this.errorMessage = 'Failed to load services.';
      }
    });
  }

  async fetchVehicles() {
    try {
      const customerId = this.authService.getCustomerId();
      if (customerId) {
        this.vehicleService.getVehiclesByCustomer(customerId).subscribe({
          next: (vehicles) => {
            this.vehicles = vehicles || [];
          },
          error: (err) => {
            this.errorMessage = 'Failed to load vehicles.';
          }
        });
      }
    } catch (err) {
      this.errorMessage = 'Failed to load vehicles.';
    }
  }

  goToStep(step: number) {
    this.errorMessage = '';
    // Always allow going back
    if (step < this.step) {
      this.step = step;
      window.scrollTo(0, 0);
      return;
    }
    // Validation for forward navigation
    if (step === 2 && !this.selectedVehicle) {
      this.errorMessage = 'Please choose a vehicle before proceeding.';
      return;
    }
    if (step === 3 && !this.services.some(s => s.selected)) {
      this.errorMessage = 'Please choose at least one service before proceeding.';
      return;
    }
    this.step = step;
    window.scrollTo(0, 0);
  }

  selectVehicle(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.showAddVehicle = false;
  }

  async addNewVehicle() {
    if (!this.newVehicle.make || !this.newVehicle.model || !this.newVehicle.year || !this.newVehicle.licensePlate || !this.newVehicle.mileage) {
      alert('Please fill all vehicle details');
      return;
    }
    try {
      const customerId = this.authService.getCustomerId();
      if (!customerId) throw new Error('No customer ID');
      const vehicleData = { ...this.newVehicle, customer_id: customerId };
      this.vehicleService.addVehicle(vehicleData).subscribe({
        next: (vehicle) => {
          this.fetchVehicles();
          this.selectedVehicle = vehicle;
          this.newVehicle = { make: '', model: '', year: 2024, licensePlate: '', mileage: 0, vin: '' };
          this.showAddVehicle = false;
        },
        error: (err) => {
          alert('Failed to add vehicle.');
        }
      });
    } catch (err) {
      alert('Failed to add vehicle.');
    }
  }

  toggleService(service: any) {
    service.selected = !service.selected;
  }

  selectTimeSlot(slot: string) {
    this.appointmentTime = slot;
  }

  getTotalPrice() {
    return this.services.filter(s => s.selected).reduce((sum, s) => sum + s.price, 0);
  }

  confirmBooking() {
    if (!this.selectedVehicle) {
      alert('Please select a vehicle');
      this.goToStep(1);
      return;
    }
    if (!this.services.some(s => s.selected)) {
      alert('Please select at least one service');
      this.goToStep(2);
      return;
    }
    if (!this.appointmentDate) {
      alert('Please select a date');
      return;
    }
    if (!this.appointmentTime) {
      alert('Please select a time slot');
      return;
    }
    // Prepare appointment object for backend
    const customerId = this.authService.getCustomerId();
    console.log('Booking with customer_id:', customerId);
    if (!customerId) {
      alert('Could not determine customer ID.');
      return;
    }
    // Only one service allowed per appointment as per DB schema
    const selectedService = this.services.find(s => s.selected);
    if (!selectedService) {
      alert('Please select a service');
      return;
    }
    const appointment = {
      customer_id: customerId,
      vehicle_id: this.selectedVehicle.id,
      service_id: selectedService.id,
      appointment_date: this.toMySQLDateTime(this.appointmentDate, this.appointmentTime),
      notes: this.serviceNotes?.trim() || '',
      status: 'Pending',
      price: selectedService.price
    };
    this.showProcessing = true;
    this.appointmentService.bookAppointment(appointment).subscribe({
      next: () => {
        this.showProcessing = false;
        this.showSuccess = true;
      },
      error: (err) => {
        this.showProcessing = false;
        alert('Failed to book appointment. Please try again.');
      }
    });
  }

  redirectToAppointments() {
    this.showSuccess = false;
    this.router.navigate(['/customer/appointments']);
  }

  goToDashboard() {
    this.router.navigate(['/customer/home']);
  }

  navigateHome() {
    this.router.navigate(['/customer/dashboard']);
  }
}
