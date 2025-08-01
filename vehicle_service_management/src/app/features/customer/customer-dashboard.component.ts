import { Component, OnInit } from '@angular/core';
import { Appointment, LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  customer = {
    name: 'Trishala Saravanan',
    email: 'trishalasaravanan@gmail.com',
    phone: '9345260068',
    address: '9, D.H.O STREET, VENGAMEDU, KARUR.'
  };

  vehicles = [
    { make: 'Toyota', model: 'Camry', year: 2018, license: 'TN-01-AB-1234' },
    { make: 'Honda', model: 'City', year: 2021, license: 'TN-09-XY-5678' }
  ];

  appointments: Appointment[] = [];

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    const currentUser = this.localStorage.getCurrentUser();
    if (currentUser) {
      this.customer = {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      };
      this.appointments = this.localStorage.getCustomerAppointments(currentUser.id);
    }
  }
}
