import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehicleService } from '../../../services/vehicle.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, CommonModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  onRemoveVehicle(vehicleId: string) {
    if (!confirm('Are you sure you want to remove this vehicle?')) return;
    this.vehicleService.deleteVehicle(vehicleId).subscribe({
      next: () => {
        this.vehicles = this.vehicles.filter(v => v.id !== vehicleId);
      },
      error: (err) => {
        alert('Failed to remove vehicle: ' + (err.error?.message || err.message));
      }
    });
  }
  showAddModal = false;
  showSuccessModal = false;
  newVehicle = { brand: '', model: '', year: '', licensePlate: '', mileage: '', vin: '' };
  vehicles: any[] = [];

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private authService: AuthService
  ) {}

  navigateHome() {
    this.router.navigate(['/customer/home']);
  }

  showAddVehicleModal() {
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  onAddVehicle() {
    this.authService.getCustomerProfile().then(profileResp => {
      const customer_id = profileResp?.profile?.id;
      if (!customer_id) {
        alert('Customer ID not found.');
        return;
      }
      const vehicleData = {
        customer_id,
        make: this.newVehicle.brand,
        model: this.newVehicle.model,
        year: this.newVehicle.year,
        vin: this.newVehicle.vin,
        license_plate: this.newVehicle.licensePlate,
        mileage: this.newVehicle.mileage
      };
      this.vehicleService.addVehicle(vehicleData).subscribe({
        next: () => {
          this.showAddModal = false;
          this.showSuccessModal = true;
          this.fetchVehicles();
        },
        error: (err) => {
          alert('Failed to add vehicle: ' + (err.error?.message || err.message));
        }
      });
    });
  }

  ngOnInit(): void {
    this.fetchVehicles();
  }

  fetchVehicles() {
    this.authService.getCustomerProfile().then(profileResp => {
      const customer_id = profileResp?.profile?.id;
      if (!customer_id) {
        console.warn('No customer_id found in profile', profileResp);
        return;
      }
      this.vehicleService.getVehiclesByCustomer(customer_id).subscribe({
        next: (vehicles) => {
          this.vehicles = vehicles;
          console.log('Fetched vehicles:', vehicles);
        },
        error: (err) => {
          this.vehicles = [];
          console.error('Error fetching vehicles:', err);
        }
      });
    });
  }
}
