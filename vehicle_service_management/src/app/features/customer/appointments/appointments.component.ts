
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgFor, NgClass, NgIf, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  imports: [NgFor, NgClass, NgIf, DatePipe]
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  appointments: any[] = [];
  private routerSubscription: Subscription;
  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadAppointments();
      }
    });
  }


  async ngOnInit() {
    // Ensure customer profile is loaded before fetching appointments
    if (!this.authService.getCustomerId()) {
      await this.authService.loadCustomerProfile();
    }
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  deleteAppointment(appointment: any) {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.updateAppointmentStatus(appointment.id, 'Rejected').subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (err) => {
          alert('Failed to delete appointment.');
        }
      });
    }
  }

  loadAppointments() {
    const customerId = this.authService.getCustomerId();
    if (!customerId) {
      this.appointments = [];
      return;
    }
    this.appointmentService.getAppointmentsByCustomer(customerId).subscribe({
      next: (appointments) => {
        this.appointments = appointments || [];
      },
      error: () => {
        this.appointments = [];
      }
    });
  }

  navigateHome() {
    this.router.navigate(['/customer/home']);
  }

  navigateToBookAppointment() {
    this.router.navigate(['/customer/book-appointment']);
  }
}
