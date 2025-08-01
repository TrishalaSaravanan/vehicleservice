<<<<<<< HEAD
<<<<<<< HEAD
# vehicleservice
=======
# VehicleServiceManagement
=======
# Vehicle Service Management System
>>>>>>> cfbd646 (Initial commit)

## Overview
A comprehensive web application for managing vehicle servicing, customer appointments, mechanic assignments, and service center operations. Built with Angular for the frontend.

## 🔄 Application Flow
1. **Authentication**  
   - Login for Admin, Mechanics, and Customers
   - Signup for new customers
2. **Admin Dashboard**  
   - Manage users, services, reports, and bookings
   - View statistics and recent activities
3. **Mechanic Portal**  
   - View assigned work orders
   - Manage parts inventory
   - Track service history
4. **Customer Portal**  
   - Book appointments
   - View vehicle history
   - Manage profile

## 👥 User Roles & Credentials

**Admin Credentials**

- **Email**: `admin@mechniq.com`
- **Password**: `admin123`

**Mechanic Credentials:**

- **Email**: `mechanic@mechniq.com`
- **Password**: `mechanic123`

## 📂 Project Structure
├── app
│   ├── components
│   │   └── storage-demo
│   │       ├── storage-demo.component.css
│   │       ├── storage-demo.component.html
│   │       └── storage-demo.component.ts
│   ├── features
│   │   ├── admin
│   │   │   ├── admin-profile
│   │   │   │   ├── admin-profile.component.css
│   │   │   │   ├── admin-profile.component.html
│   │   │   │   └── admin-profile.component.ts
│   │   │   ├── admin-sidebar
│   │   │   │   ├── admin-sidebar.component.css
│   │   │   │   ├── admin-sidebar.component.html
│   │   │   │   ├── admin-sidebar.component.spec.ts
│   │   │   │   └── admin-sidebar.component.ts
│   │   │   ├── content-management
│   │   │   │   └── content-management.component.ts
│   │   │   ├── dashboard
│   │   │   │   ├── dashboard.component.css
│   │   │   │   ├── dashboard.component.html
│   │   │   │   ├── dashboard.component.spec.ts
│   │   │   │   └── dashboard.component.ts
│   │   │   ├── header
│   │   │   │   ├── header.component.css
│   │   │   │   ├── header.component.html
│   │   │   │   ├── header.component.spec.ts
│   │   │   │   └── header.component.ts
│   │   │   ├── layout
│   │   │   │   └── admin-layout.component.ts
│   │   │   ├── mechanic-assign
│   │   │   │   ├── mechanic-assign-new.component.ts
│   │   │   │   ├── mechanic-assign.component.css
│   │   │   │   ├── mechanic-assign.component.html
│   │   │   │   └── mechanic-assign.component.ts
│   │   │   ├── recent-activity
│   │   │   │   ├── recent-activity.component.css
│   │   │   │   ├── recent-activity.component.html
│   │   │   │   ├── recent-activity.component.spec.ts
│   │   │   │   └── recent-activity.component.ts
│   │   │   ├── recent-bookings
│   │   │   │   ├── recent-bookings-new.component.ts
│   │   │   │   ├── recent-bookings.component.css
│   │   │   │   ├── recent-bookings.component.html
│   │   │   │   ├── recent-bookings.component.spec.ts
│   │   │   │   └── recent-bookings.component.ts
│   │   │   ├── report-management
│   │   │   │   ├── report-management.component.css
│   │   │   │   ├── report-management.component.html
│   │   │   │   └── report-management.component.ts
│   │   │   ├── reports
│   │   │   │   └── reports.component.ts
│   │   │   ├── service-management
│   │   │   │   ├── service-management.component.css
│   │   │   │   ├── service-management.component.html
│   │   │   │   └── service-management.component.ts
│   │   │   ├── stats-cards
│   │   │   │   ├── stats-cards.component.css
│   │   │   │   ├── stats-cards.component.html
│   │   │   │   ├── stats-cards.component.spec.ts
│   │   │   │   └── stats-cards.component.ts
│   │   │   ├── today-schedules
│   │   │   │   ├── today-schedules.component.css
│   │   │   │   ├── today-schedules.component.html
│   │   │   │   ├── today-schedules.component.spec.ts
│   │   │   │   └── today-schedules.component.ts
│   │   │   └── user-management
│   │   │       └── user-management.component.ts
│   │   ├── customer
│   │   │   ├── appointments
│   │   │   │   ├── appointments.component.css
│   │   │   │   ├── appointments.component.html
│   │   │   │   └── appointments.component.ts
│   │   │   ├── book-appointment
│   │   │   │   ├── book-appointment.component.css
│   │   │   │   ├── book-appointment.component.html
│   │   │   │   └── book-appointment.component.ts
│   │   │   ├── customer-home
│   │   │   │   ├── customer-home.component.css
│   │   │   │   ├── customer-home.component.html
│   │   │   │   └── customer-home.component.ts
│   │   │   ├── profile
│   │   │   │   ├── edit-profile.component.css
│   │   │   │   ├── edit-profile.component.html
│   │   │   │   ├── edit-profile.component.ts
│   │   │   │   ├── profile.component.css
│   │   │   │   ├── profile.component.html
│   │   │   │   └── profile.component.ts
│   │   │   ├── vehicles
│   │   │   │   ├── vehicles.component.css
│   │   │   │   ├── vehicles.component.html
│   │   │   │   └── vehicles.component.ts
│   │   │   ├── customer-dashboard.component.css
│   │   │   ├── customer-dashboard.component.html
│   │   │   └── customer-dashboard.component.ts
│   │   ├── home
│   │   │   ├── home.component.css
│   │   │   ├── home.component.html
│   │   │   ├── home.component.spec.ts
│   │   │   └── home.component.ts
│   │   ├── login
│   │   │   ├── login.component.css
│   │   │   ├── login.component.html
│   │   │   ├── login.component.spec.ts
│   │   │   └── login.component.ts
│   │   ├── mechanic
│   │   │   ├── layout
│   │   │   │   └── mechanic-layout.component.ts
│   │   │   ├── mechanic-dashboard
│   │   │   │   ├── mechanic-dashboard-clean.component.css
│   │   │   │   ├── mechanic-dashboard-clean.component.html
│   │   │   │   └── mechanic-dashboard-clean.component.ts
│   │   │   ├── mechanic-profile
│   │   │   │   ├── mechanic-profile.component.css
│   │   │   │   ├── mechanic-profile.component.html
│   │   │   │   └── mechanic-profile.component.ts
│   │   │   ├── mechanic-sidebar
│   │   │   │   └── mechanic-sidebar.component.ts
│   │   │   ├── parts-inventory
│   │   │   │   ├── parts-inventory.component.css
│   │   │   │   ├── parts-inventory.component.html
│   │   │   │   └── parts-inventory.component.ts
│   │   │   ├── service-history
│   │   │   │   ├── service-history.component.css
│   │   │   │   ├── service-history.component.html
│   │   │   │   └── service-history.component.ts
│   │   │   └── work-orders
│   │   │       ├── file-url.pipe.ts
│   │   │       ├── work-orders.component.css
│   │   │       ├── work-orders.component.html
│   │   │       └── work-orders.component.ts
│   │   └── signup
│   │       ├── signup.component.css
│   │       ├── signup.component.html
│   │       ├── signup.component.spec.ts
│   │       └── signup.component.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── guards.service.ts
│   │   └── local-storage.service.ts
│   ├── shared
│   │   ├── about
│   │   │   ├── about.component.css
│   │   │   ├── about.component.html
│   │   │   ├── about.component.spec.ts
│   │   │   └── about.component.ts
│   │   ├── contact
│   │   │   ├── contact.component.css
│   │   │   ├── contact.component.html
│   │   │   ├── contact.component.spec.ts
│   │   │   └── contact.component.ts
│   │   ├── footer
│   │   │   ├── footer.component.css
│   │   │   ├── footer.component.html
│   │   │   ├── footer.component.spec.ts
│   │   │   └── footer.component.ts
│   │   ├── hero
│   │   │   ├── hero.component.css
│   │   │   ├── hero.component.html
│   │   │   ├── hero.component.spec.ts
│   │   │   └── hero.component.ts
│   │   ├── nav
│   │   │   ├── nav.component.css
│   │   │   ├── nav.component.html
│   │   │   ├── nav.component.spec.ts
│   │   │   └── nav.component.ts
│   │   └── services
│   │       ├── services.component.css
│   │       ├── services.component.html
│   │       ├── services.component.spec.ts
│   │       └── services.component.ts
│   ├── app.component.css
│   ├── app.component.html
│   ├── app.component.spec.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── index.html
├── main.ts
└── styles.css

text

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- Angular CLI (`npm install -g @angular/cli`)
- Git (optional)

### Installation Steps


bash

ng serve --o

Application will be available at http://localhost:4200

🚀 Running the Application
Open http://localhost:4200 in your browser

Login using one of the test credentials above

Explore features based on your role:

Admin: Manage users and view reports

Mechanic: View assigned work orders

Customer: Book appointments

<<<<<<< HEAD
For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
>>>>>>> 554dc98 (initial commit)
=======
🔒 Authentication Flow
User enters credentials

System validates against stored data

JWT token issued for session management

Route guards protect role-specific routes


For any issues, contact:

Email: trishalasaravanan26@gmail.com

Phone: 9345260068S
>>>>>>> cfbd646 (Initial commit)
