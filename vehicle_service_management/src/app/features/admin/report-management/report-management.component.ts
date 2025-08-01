import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, CustomerReport, MechanicReport } from '../../../services/report.service';

@Component({
  selector: 'app-report-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-management.component.html',
  styleUrl: './report-management.component.css'
})
export class ReportManagementComponent implements OnInit {
  currentReportType: string = 'customers';
  showPreviewModal: boolean = false;
  previewContent: string = '';
  loading: boolean = false;
  
  // Math for template calculations
  Math = Math;

  // Data arrays
  customersData: CustomerReport[] = [];
  mechanicsData: MechanicReport[] = [];
  filteredCustomers: CustomerReport[] = [];
  filteredMechanics: MechanicReport[] = [];

  // Filter properties
  customerSearch: string = '';
  customerStatusFilter: string = 'all';
  customerVisitsFilter: string = 'all';

  mechanicSearch: string = '';
  mechanicStatusFilter: string = 'all';
  mechanicSpecializationFilter: string = 'all';

  // Pagination properties
  customersPerPage: number = 5;
  mechanicsPerPage: number = 5;
  currentCustomerPage: number = 1;
  currentMechanicPage: number = 1;
  paginatedCustomers: CustomerReport[] = [];
  paginatedMechanics: MechanicReport[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadCustomerData();
    this.loadMechanicData();
  }

  loadCustomerData() {
    this.loading = true;
    this.reportService.getCustomerReport().subscribe({
      next: (response) => {
        if (response.success) {
          this.customersData = response.customers;
          this.filteredCustomers = [...this.customersData];
          this.updateCustomerPagination();
          console.log('Customer data loaded:', this.customersData.length);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customer data:', error);
        this.customersData = [];
        this.filteredCustomers = [];
        this.loading = false;
      }
    });
  }

  loadMechanicData() {
    this.reportService.getMechanicReport().subscribe({
      next: (response) => {
        if (response.success) {
          this.mechanicsData = response.mechanics;
          this.filteredMechanics = [...this.mechanicsData];
          this.updateMechanicPagination();
          console.log('Mechanic data loaded:', this.mechanicsData.length);
        }
      },
      error: (error) => {
        console.error('Error loading mechanic data:', error);
        this.mechanicsData = [];
        this.filteredMechanics = [];
      }
    });
  }

  showReport(type: string) {
    this.currentReportType = type;
    // Initialize pagination when switching report types
    if (type === 'customers') {
      this.currentCustomerPage = 1;
      this.updateCustomerPagination();
    } else {
      this.currentMechanicPage = 1;
      this.updateMechanicPagination();
    }
  }

  filterCustomers() {
    this.filteredCustomers = this.customersData.filter(customer => {
      const matchesSearch = 
        customer.customer_id.toLowerCase().includes(this.customerSearch.toLowerCase()) ||
        customer.name.toLowerCase().includes(this.customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.customerSearch.toLowerCase()) ||
        customer.phone.includes(this.customerSearch);
      
      const matchesStatus = this.customerStatusFilter === 'all' || customer.status.toLowerCase() === this.customerStatusFilter.toLowerCase();
      
      let matchesVisits = true;
      if (this.customerVisitsFilter === '1-3') {
        matchesVisits = customer.total_appointments >= 1 && customer.total_appointments <= 3;
      } else if (this.customerVisitsFilter === '4-6') {
        matchesVisits = customer.total_appointments >= 4 && customer.total_appointments <= 6;
      } else if (this.customerVisitsFilter === '7+') {
        matchesVisits = customer.total_appointments >= 7;
      }
      
      return matchesSearch && matchesStatus && matchesVisits;
    });
    
    // Reset to first page when filtering
    this.currentCustomerPage = 1;
    this.updateCustomerPagination();
  }

  filterMechanics() {
    this.filteredMechanics = this.mechanicsData.filter(mechanic => {
      const matchesSearch = 
        mechanic.name.toLowerCase().includes(this.mechanicSearch.toLowerCase()) ||
        mechanic.email.toLowerCase().includes(this.mechanicSearch.toLowerCase()) ||
        mechanic.phone.includes(this.mechanicSearch) ||
        mechanic.specializations.toLowerCase().includes(this.mechanicSearch.toLowerCase());
      
      const matchesStatus = this.mechanicStatusFilter === 'all' || mechanic.status.toLowerCase() === this.mechanicStatusFilter.toLowerCase();
      const matchesSpecialization = this.mechanicSpecializationFilter === 'all' || 
        mechanic.specializations.toLowerCase().includes(this.mechanicSpecializationFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesSpecialization;
    });
    
    // Reset to first page when filtering
    this.currentMechanicPage = 1;
    this.updateMechanicPagination();
  }

  // Pagination Methods
  updateCustomerPagination() {
    const startIndex = (this.currentCustomerPage - 1) * this.customersPerPage;
    const endIndex = startIndex + this.customersPerPage;
    this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
  }

  updateMechanicPagination() {
    const startIndex = (this.currentMechanicPage - 1) * this.mechanicsPerPage;
    const endIndex = startIndex + this.mechanicsPerPage;
    this.paginatedMechanics = this.filteredMechanics.slice(startIndex, endIndex);
  }

  // Customer Pagination
  get totalCustomerPages(): number {
    return Math.ceil(this.filteredCustomers.length / this.customersPerPage);
  }

  goToCustomerPage(page: number) {
    if (page >= 1 && page <= this.totalCustomerPages) {
      this.currentCustomerPage = page;
      this.updateCustomerPagination();
    }
  }

  nextCustomerPage() {
    if (this.currentCustomerPage < this.totalCustomerPages) {
      this.currentCustomerPage++;
      this.updateCustomerPagination();
    }
  }

  previousCustomerPage() {
    if (this.currentCustomerPage > 1) {
      this.currentCustomerPage--;
      this.updateCustomerPagination();
    }
  }

  // Mechanic Pagination
  get totalMechanicPages(): number {
    return Math.ceil(this.filteredMechanics.length / this.mechanicsPerPage);
  }

  goToMechanicPage(page: number) {
    if (page >= 1 && page <= this.totalMechanicPages) {
      this.currentMechanicPage = page;
      this.updateMechanicPagination();
    }
  }

  nextMechanicPage() {
    if (this.currentMechanicPage < this.totalMechanicPages) {
      this.currentMechanicPage++;
      this.updateMechanicPagination();
    }
  }

  previousMechanicPage() {
    if (this.currentMechanicPage > 1) {
      this.currentMechanicPage--;
      this.updateMechanicPagination();
    }
  }

  printReport() {
    this.showPrintPreview();
  }

  showPrintPreview() {
    const currentDate = new Date().toLocaleDateString();
    const title = this.getReportTitle();
    const companyName = "MechniQ Vehicle Service Center"; // You can make this dynamic if needed
    const adminName = "Administrator"; // You can get this from your auth service if needed
    
    // Prepare table data
    let headers: string[];
    let data: any[];
    
    if (this.currentReportType === 'customers') {
      headers = ['ID', 'Name', 'Email', 'Phone', 'Vehicle', 'Last Service', 'Total Visits', 'Status'];
      data = this.filteredCustomers;
    } else {
      headers = ['ID', 'Name', 'Email', 'Phone', 'Specialization', 'Total Jobs', 'Rating', 'Status'];
      data = this.filteredMechanics;
    }

    // Generate preview content
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${title} - Print Preview</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 20px;
            background: white;
        }
        .report-header { 
            text-align: center; 
            margin-bottom: 30px;
            padding: 20px;
            border-bottom: 2px solid #1B4B88;
        }
        .company-name {
            color: #1B4B88;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .report-title { 
            color: #1B4B88;
            font-size: 24px;
            margin: 15px 0 10px 0;
        }
        .report-meta {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            color: #666;
            font-size: 14px;
        }
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #1B4B88;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .print-button:hover {
            background: #164080;
        }
        @media print {
            .print-button {
                display: none;
            }
        }
        .summary { 
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .summary h3 { 
            color: #1B4B88;
            margin: 0 0 15px 0;
        }
        .summary-stats {
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
        }
        .stat-item {
            padding: 10px 20px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        table { 
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        th { 
            background: #1B4B88;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td { 
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) {
            background: #f8f9fa;
        }
        .status-active { 
            color: #065f46;
            font-weight: bold;
        }
        .status-inactive { 
            color: #dc2626;
            font-weight: bold;
        }
        .footer { 
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #666;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: flex-end;
            padding-right: 50px;
        }
        .signature-box {
            text-align: center;
        }
        .signature-line {
            width: 200px;
            border-top: 1px solid #000;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <button onclick="window.print()" class="print-button">🖨️ Print Report</button>
    
    <div class="report-header">
        <div class="company-name">${companyName}</div>
        <div class="report-title">${title}</div>
        <div class="report-meta">
            <span>Generated by: ${adminName}</span>
            <span>Date: ${currentDate}</span>
        </div>
    </div>
    
    <div class="summary">
        <h3>Summary Statistics</h3>
        <div class="summary-stats">`;
    
    if (this.currentReportType === 'customers') {
      htmlContent += `
            <div class="stat-item">
                <strong>Total Customers:</strong> ${this.getCustomersCount()}
            </div>`;
    } else {
      htmlContent += `
            <div class="stat-item">
                <strong>Total Mechanics:</strong> ${this.getMechanicsCount()}
            </div>`;
    }
    
    htmlContent += `
        </div>
    </div>
    
    <table>
        <thead>
            <tr>`;
    
    headers.forEach(header => {
      htmlContent += `<th>${header}</th>`;
    });
    
    htmlContent += `
            </tr>
        </thead>
        <tbody>`;
    
    data.forEach(row => {
      htmlContent += '<tr>';
      if (this.currentReportType === 'customers') {
        const customer = row as CustomerReport;
        htmlContent += `
            <td>${customer.customer_id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.total_appointments}</td>
            <td>${customer.total_spent}</td>
            <td>${customer.last_appointment_date}</td>
            <td>${customer.vehicle_count}</td>
            <td>${customer.registration_date}</td>
            <td class="status-${customer.status.toLowerCase()}">${customer.status}</td>`;
      } else {
        const mechanic = row as MechanicReport;
        htmlContent += `
            <td>${mechanic.name}</td>
            <td>${mechanic.email}</td>
            <td>${mechanic.phone}</td>
            <td>${mechanic.experience} years</td>
            <td>${mechanic.specializations}</td>
            <td>${mechanic.certifications}</td>
            <td>${mechanic.join_date}</td>
            <td class="status-${mechanic.status.toLowerCase()}">${mechanic.status}</td>`;
      }
      htmlContent += '</tr>';
    });
    
    htmlContent += `
        </tbody>
    </table>
    
    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Administrator Signature</div>
        </div>
    </div>

    <div class="footer">
        <p>Generated by MechniQ Vehicle Service Management System</p>
        <p>Report contains ${data.length} records</p>
        <p>This is a system generated report</p>
    </div>
</body>
</html>`;

    // Open the preview in a new window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  }

  closePreviewModal() {
    this.showPreviewModal = false;
  }

  printPreview() {
    window.print();
  }

  exportToExcel() {
    const data = this.currentReportType === 'customers' ? this.filteredCustomers : this.filteredMechanics;
    const headers = this.currentReportType === 'customers' 
      ? ['ID', 'Name', 'Email', 'Phone', 'Vehicle', 'Last Service', 'Total Visits', 'Status']
      : ['Name', 'Email', 'Phone', 'Experience', 'Specializations', 'Certifications', 'Join Date', 'Status'];
    
    // Add summary information at the top
    let csv = `${this.getReportTitle()}\n`;
    csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    // Add summary statistics
    if (this.currentReportType === 'customers') {
      csv += `Total Customers: ${this.getCustomersCount()}\n\n`;
    } else {
      csv += `Total Mechanics: ${this.getMechanicsCount()}\n\n`;
    }
    
    // Add table headers
    csv += headers.join(',') + '\n';
    
    // Add data rows
    data.forEach(row => {
      const values = this.currentReportType === 'customers' 
        ? [(row as CustomerReport).customer_id, (row as CustomerReport).name, (row as CustomerReport).email, (row as CustomerReport).phone, 
           (row as CustomerReport).total_appointments, (row as CustomerReport).total_spent, (row as CustomerReport).last_appointment_date, 
           (row as CustomerReport).vehicle_count, (row as CustomerReport).registration_date, (row as CustomerReport).status]
        : [(row as MechanicReport).name, (row as MechanicReport).email, (row as MechanicReport).phone, 
           (row as MechanicReport).experience, (row as MechanicReport).specializations, (row as MechanicReport).certifications,
           (row as MechanicReport).join_date, (row as MechanicReport).status];
      
      // Properly escape values that contain commas or quotes
      const escapedValues = values.map(value => {
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      
      csv += escapedValues.join(',') + '\n';
    });
    
    // Create and download the file
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.currentReportType}_report_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('CSV report exported successfully!');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading CSV file. Please try again.');
    }
  }

  generateCSVContent(): string {
    const currentDate = new Date().toLocaleDateString();
    const title = this.getReportTitle();
    
    let csvContent = `${title}\n`;
    csvContent += `Generated on: ${currentDate}\n\n`;
    
    // Add summary statistics
    if (this.currentReportType === 'customers') {
      csvContent += `Total Customers: ${this.getCustomersCount()}\n\n`;
    } else {
      csvContent += `Total Mechanics: ${this.getMechanicsCount()}\n\n`;
    }
    
    // Add data
    const data = this.currentReportType === 'customers' ? this.filteredCustomers : this.filteredMechanics;
    const headers = this.currentReportType === 'customers'
      ? ['Customer ID', 'Name', 'Email', 'Phone', 'Total Appointments', 'Total Spent', 'Last Appointment', 'Vehicle Count', 'Registration Date', 'Status']
      : ['Name', 'Email', 'Phone', 'Experience', 'Specializations', 'Certifications', 'Join Date', 'Status'];

    csvContent += headers.join(',') + '\n';

    data.forEach(row => {
      const values = this.currentReportType === 'customers'
        ? [(row as CustomerReport).customer_id, (row as CustomerReport).name, (row as CustomerReport).email, (row as CustomerReport).phone, 
           (row as CustomerReport).total_appointments, (row as CustomerReport).total_spent, (row as CustomerReport).last_appointment_date, 
           (row as CustomerReport).vehicle_count, (row as CustomerReport).registration_date, (row as CustomerReport).status]
        : [(row as MechanicReport).name, (row as MechanicReport).email, (row as MechanicReport).phone, 
           (row as MechanicReport).experience, (row as MechanicReport).specializations, (row as MechanicReport).certifications,
           (row as MechanicReport).join_date, (row as MechanicReport).status];      const escapedValues = values.map(value => {
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      
      csvContent += escapedValues.join(',') + '\n';
    });
    
    return csvContent;
  }

  getReportTitle(): string {
    return this.currentReportType === 'customers' ? 'Customers Report' : 'Mechanics Report';
  }

  getCustomersCount(): number {
    return this.filteredCustomers.length;
  }

  getMechanicsCount(): number {
    return this.filteredMechanics.length;
  }
}
