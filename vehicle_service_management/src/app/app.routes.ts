import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { AdminLayoutComponent } from './features/admin/layout/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { ContentManagementComponent } from './features/admin/content-management/content-management.component';
import { ReportManagementComponent } from './features/admin/report-management/report-management.component';
import { AdminProfileComponent } from './features/admin/admin-profile/admin-profile.component';
import { CustomerHomeComponent } from './features/customer/customer-home/customer-home.component';
import { MechanicLayoutComponent } from './features/mechanic/layout/mechanic-layout.component';
import { MechanicProfileComponent } from './features/mechanic/mechanic-profile/mechanic-profile.component';
import { PartsInventoryComponent } from './features/mechanic/parts-inventory/parts-inventory.component';
import { ServiceHistoryComponent } from './features/mechanic/service-history/service-history.component';
import { WorkOrdersComponent } from './features/mechanic/work-orders/work-orders.component';
import { StorageDemoComponent } from './components/storage-demo/storage-demo.component';
import { MechanicDashboardComponent } from './features/mechanic/mechanic-dashboard/mechanic-dashboard-clean.component';
import { BookAppointmentComponent } from './features/customer/book-appointment/book-appointment.component';
import { ProfileComponent } from './features/customer/profile/profile.component';
import { EditProfileComponent } from './features/customer/profile/edit-profile.component';
import { AppointmentsComponent } from './features/customer/appointments/appointments.component';
import { VehiclesComponent } from './features/customer/vehicles/vehicles.component';
import { ServiceManagementComponent } from './features/admin/service-management/service-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'login', 
    component: LoginComponent  
  },
  { 
    path: 'signup', 
    component: SignupComponent 
  },
  {
    path: 'storage-demo',
    component: StorageDemoComponent
  },
  {
    path: 'customer',
    children: [
      { path: 'home', component: CustomerHomeComponent },
      { path: 'book-appointment', component: BookAppointmentComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/edit', component: EditProfileComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: 'mechanic',
    component: MechanicLayoutComponent,
    children: [
      { path: 'dashboard', component: MechanicDashboardComponent },
      { path: 'profile', component: MechanicProfileComponent },
      { path: 'parts-inventory', component: PartsInventoryComponent },
      { path: 'service-history', component: ServiceHistoryComponent },
      { path: 'work-orders', component: WorkOrdersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'service-management', component: ServiceManagementComponent },
      { path: 'content-management', component: ContentManagementComponent },
      { path: 'report-management', component: ReportManagementComponent },
      { path: 'profile', component: AdminProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
    // Add auth guard if needed
    // canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

export class AppRoutingModule { }

