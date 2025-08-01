import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { UserManagementComponent } from '../../../src/app/features/admin/user-management/user-management.component';
import { AuthService } from '../../../src/app/services/auth.service';
import { LocalStorageService } from '../../../src/app/services/local-storage.service';
import { MechanicService } from '../../../src/app/services/mechanic.service';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let mechanicService: jasmine.SpyObj<MechanicService>;
  let httpMock: HttpTestingController;

  // Mock data
  const mockCustomers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@test.com',
      phone: '1234567890',
      address: '123 Main St',
      is_active: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@test.com',
      phone: '0987654321',
      address: '456 Oak Ave',
      is_active: false
    }
  ];

  const mockMechanics = [
    {
      id: '1',
      name: 'Mike Johnson',
      email: 'mike@test.com',
      phone: '1111111111',
      experience: 5,
      certification: ['ASE Certified'],
      specialization: ['Engine Repair']
    }
  ];

  beforeEach(async () => {
    // Create spy objects
    const authSpy = jasmine.createSpyObj('AuthService', [
      'getAllCustomers',
      'updateCustomerByAdmin',
      'deleteCustomerByAdmin'
    ]);
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'getMechanics',
      'addMechanic',
      'updateMechanic',
      'deleteMechanic'
    ]);
    const mechanicSpy = jasmine.createSpyObj('MechanicService', [
      'getAllMechanics',
      'updateMechanic',
      'deleteMechanic'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        UserManagementComponent,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: MechanicService, useValue: mechanicSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    mechanicService = TestBed.inject(MechanicService) as jasmine.SpyObj<MechanicService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with customers tab active', () => {
      expect(component.activeTab).toBe('customers');
    });

    it('should load customers on init', async () => {
      authService.getAllCustomers.and.returnValue(Promise.resolve(mockCustomers));
      
      await component.ngOnInit();
      
      expect(authService.getAllCustomers).toHaveBeenCalled();
      expect(component.customers).toEqual(mockCustomers);
    });

    it('should handle error when loading customers fails', async () => {
      authService.getAllCustomers.and.returnValue(Promise.reject(new Error('Network error')));
      spyOn(console, 'error');
      
      await component.ngOnInit();
      
      expect(console.error).toHaveBeenCalled();
      expect(component.customers).toEqual([]);
    });
  });

  describe('Tab Management', () => {
    it('should switch to mechanics tab', () => {
      component.setActiveTab('mechanics');
      expect(component.activeTab).toBe('mechanics');
    });

    it('should switch to customers tab', () => {
      component.setActiveTab('customers');
      expect(component.activeTab).toBe('customers');
    });

    it('should return correct tab classes for active tab', () => {
      component.activeTab = 'customers';
      const classes = component.getTabClasses('customers');
      expect(classes).toContain('text-primary');
      expect(classes).toContain('border-primary');
    });

    it('should return correct tab classes for inactive tab', () => {
      component.activeTab = 'customers';
      const classes = component.getTabClasses('mechanics');
      expect(classes).toContain('text-gray-600');
      expect(classes).toContain('border-transparent');
    });
  });

  describe('Customer Management', () => {
    beforeEach(() => {
      component.customers = [...mockCustomers];
    });

    it('should open edit modal for customer', () => {
      const customer = mockCustomers[0];
      
      component.editCustomer(customer);
      
      expect(component.showEditModal).toBe(true);
      expect(component.editingCustomer).toEqual({
        ...customer,
        status: customer.is_active ? 'Active' : 'Inactive'
      });
    });

    it('should close edit modal', () => {
      component.showEditModal = true;
      component.editingCustomer = { ...mockCustomers[0] };
      
      component.closeEditModal();
      
      expect(component.showEditModal).toBe(false);
      expect(component.editingCustomer).toEqual({});
    });

    it('should save customer changes successfully', async () => {
      const updatedCustomer = { ...mockCustomers[0], name: 'Updated Name' };
      component.editingCustomer = { ...updatedCustomer, status: 'Active' };
      authService.updateCustomerByAdmin.and.returnValue(Promise.resolve({ success: true }));
      
      await component.saveCustomer();
      
      expect(authService.updateCustomerByAdmin).toHaveBeenCalledWith(
        updatedCustomer.id,
        {
          name: updatedCustomer.name,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone,
          address: updatedCustomer.address,
          is_active: true
        }
      );
      expect(component.showEditModal).toBe(false);
    });

    it('should handle error when saving customer fails', async () => {
      component.editingCustomer = { ...mockCustomers[0], status: 'Active' };
      authService.updateCustomerByAdmin.and.returnValue(Promise.reject(new Error('Save failed')));
      spyOn(console, 'error');
      spyOn(window, 'alert');
      
      await component.saveCustomer();
      
      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Error updating customer');
    });

    it('should confirm and delete customer', async () => {
      const customer = mockCustomers[0];
      spyOn(window, 'confirm').and.returnValue(true);
      authService.deleteCustomerByAdmin.and.returnValue(Promise.resolve({ success: true }));
      authService.getAllCustomers.and.returnValue(Promise.resolve(mockCustomers.slice(1)));
      
      await component.deleteCustomer(customer.id);
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this customer?');
      expect(authService.deleteCustomerByAdmin).toHaveBeenCalledWith(customer.id);
      expect(authService.getAllCustomers).toHaveBeenCalled();
    });

    it('should not delete customer when confirmation is cancelled', async () => {
      const customer = mockCustomers[0];
      spyOn(window, 'confirm').and.returnValue(false);
      
      await component.deleteCustomer(customer.id);
      
      expect(authService.deleteCustomerByAdmin).not.toHaveBeenCalled();
    });

    it('should handle error when deleting customer fails', async () => {
      const customer = mockCustomers[0];
      spyOn(window, 'confirm').and.returnValue(true);
      authService.deleteCustomerByAdmin.and.returnValue(Promise.reject(new Error('Delete failed')));
      spyOn(console, 'error');
      spyOn(window, 'alert');
      
      await component.deleteCustomer(customer.id);
      
      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Error deleting customer');
    });
  });

  describe('Search and Filter', () => {
    beforeEach(() => {
      component.customers = [...mockCustomers];
      component.filteredCustomers = [...mockCustomers];
    });

    it('should filter customers by search term', () => {
      component.searchTerm = 'John';
      
      component.filterCustomers();
      
      expect(component.filteredCustomers).toEqual([mockCustomers[0]]);
    });

    it('should filter customers by status', () => {
      component.statusFilter = 'Active';
      
      component.filterCustomers();
      
      expect(component.filteredCustomers).toEqual([mockCustomers[0]]);
    });

    it('should filter customers by both search term and status', () => {
      component.searchTerm = 'Jane';
      component.statusFilter = 'Inactive';
      
      component.filterCustomers();
      
      expect(component.filteredCustomers).toEqual([mockCustomers[1]]);
    });

    it('should show all customers when filters are cleared', () => {
      component.searchTerm = '';
      component.statusFilter = 'All';
      
      component.filterCustomers();
      
      expect(component.filteredCustomers).toEqual(mockCustomers);
    });
  });

  describe('Form Validation', () => {
    it('should validate customer form with required fields', () => {
      component.editingCustomer = {
        name: '',
        email: 'invalid-email',
        phone: '123',
        address: ''
      };
      
      const isValid = component.validateCustomerForm();
      
      expect(isValid).toBe(false);
    });

    it('should validate customer form with valid data', () => {
      component.editingCustomer = {
        name: 'John Doe',
        email: 'john@test.com',
        phone: '1234567890',
        address: '123 Main St'
      };
      
      const isValid = component.validateCustomerForm();
      
      expect(isValid).toBe(true);
    });
  });

  describe('Utility Methods', () => {
    it('should format phone number correctly', () => {
      const formatted = component.formatPhoneNumber('1234567890');
      expect(formatted).toBe('(123) 456-7890');
    });

    it('should return original number if formatting fails', () => {
      const formatted = component.formatPhoneNumber('invalid');
      expect(formatted).toBe('invalid');
    });

    it('should capitalize first letter of string', () => {
      const capitalized = component.capitalizeFirst('hello world');
      expect(capitalized).toBe('Hello world');
    });
  });
});
