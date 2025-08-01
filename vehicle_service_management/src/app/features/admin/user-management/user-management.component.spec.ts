import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UserManagementComponent } from './user-management.component';
import { LocalStorageService, User, Mechanic } from '../../../services/local-storage.service';
import { MechanicService } from '../../../services/mechanic.service';
import { AuthService } from '../../../services/auth.service';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockMechanicService: jasmine.SpyObj<MechanicService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  // Sample test data
  const sampleCustomers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      address: '123 Main St',
      is_active: true,
      role: 'customer' as const,
      password: 'password123',
      createdAt: new Date(),
      isActive: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543211',
      address: '456 Oak Ave',
      is_active: false,
      role: 'customer' as const,
      password: 'password123',
      createdAt: new Date(),
      isActive: false
    }
  ];

  const sampleMechanics = [
    {
      id: '1',
      name: 'Ramanan',
      email: 'ramanan@gmail.com',
      phone: '9122334455',
      specialization: ['Engine Repair'],
      is_active: true,
      role: 'mechanic' as const,
      experience: 5,
      certification: ['ASE Certified'],
      employeeId: 'EMP001',
      createdAt: new Date(),
      isActive: true,
      password: 'mechanic123',
      address: ''
    },
    {
      id: '2',
      name: 'Yogesh',
      email: 'yogesh@gmail.com',
      phone: '7233445566',
      specialization: ['Brake Systems'],
      is_active: false,
      role: 'mechanic' as const,
      experience: 4,
      certification: ['Brake Specialist'],
      employeeId: 'EMP002',
      createdAt: new Date(),
      isActive: false,
      password: 'mechanic123',
      address: ''
    }
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
      'getMechanics',
      'getCustomers',
      'addUser',
      'updateUser',
      'deleteUser'
    ]);

    mockMechanicService = jasmine.createSpyObj('MechanicService', [
      'getAllMechanics',
      'createMechanic',
      'updateMechanic',
      'deleteMechanic'
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getAllCustomers',
      'deleteCustomerByAdmin',
      'updateCustomerByAdmin'
    ]);

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent, FormsModule],
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: MechanicService, useValue: mockMechanicService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    // Setup default mock returns
    mockLocalStorageService.getMechanics.and.returnValue([]);
    mockLocalStorageService.getCustomers.and.returnValue([]);
    mockMechanicService.getAllMechanics.and.returnValue(of(sampleMechanics));
    mockAuthService.getAllCustomers.and.returnValue(Promise.resolve({
      success: true,
      customers: sampleCustomers
    }));
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with customers tab active', () => {
      expect(component.activeTab).toBe('customers');
    });

    it('should initialize with default pagination values', () => {
      expect(component.itemsPerPage).toBe(10);
      expect(component.currentCustomerPage).toBe(1);
      expect(component.currentMechanicPage).toBe(1);
    });

    it('should load initial data on init', async () => {
      spyOn(component, 'loadInitialData');
      spyOn(component, 'loadMechanicsFromBackend');
      spyOn(component, 'loadCustomersFromBackend');
      spyOn(component, 'searchMechanics');

      component.ngOnInit();

      expect(component.loadInitialData).toHaveBeenCalled();
      expect(component.loadMechanicsFromBackend).toHaveBeenCalled();
      expect(component.loadCustomersFromBackend).toHaveBeenCalled();
      expect(component.searchMechanics).toHaveBeenCalled();
    });
  });

  describe('Tab Management', () => {
    it('should set active tab to customers', () => {
      component.setActiveTab('customers');
      expect(component.activeTab).toBe('customers');
    });

    it('should set active tab to mechanics', () => {
      component.setActiveTab('mechanics');
      expect(component.activeTab).toBe('mechanics');
    });

    it('should return correct tab classes for active tab', () => {
      component.activeTab = 'customers';
      expect(component.getTabClasses('customers')).toContain('tab-active');
      expect(component.getTabClasses('mechanics')).not.toContain('tab-active');
    });
  });

  describe('Customer Management', () => {
    beforeEach(() => {
      component.customers = sampleCustomers.map(c => ({
        ...c,
        status: c.is_active ? 'Active' : 'Inactive'
      }));
      component.filteredCustomers = [...component.customers];
    });

    it('should load customers from backend successfully', async () => {
      await component.loadCustomersFromBackend();

      expect(mockAuthService.getAllCustomers).toHaveBeenCalled();
      expect(component.customers.length).toBe(2);
      expect(component.customers[0].status).toBe('Active');
      expect(component.customers[1].status).toBe('Inactive');
    });

    it('should handle empty customer response from backend', async () => {
      mockAuthService.getAllCustomers.and.returnValue(Promise.resolve({
        success: false,
        customers: null
      }));

      await component.loadCustomersFromBackend();

      expect(component.customers).toEqual([]);
      expect(component.filteredCustomers).toEqual([]);
      expect(component.paginatedCustomers).toEqual([]);
    });

    it('should handle customer loading error', async () => {
      // Clear existing data first
      component.customers = [];
      component.filteredCustomers = [];
      component.paginatedCustomers = [];
      
      mockAuthService.getAllCustomers.and.returnValue(Promise.reject('Error'));

      await component.loadCustomersFromBackend();

      expect(component.customers).toEqual([]);
      expect(component.filteredCustomers).toEqual([]);
      expect(component.paginatedCustomers).toEqual([]);
    });

    it('should search customers by name', () => {
      component.customerSearch = 'John';
      component.searchCustomers();

      expect(component.filteredCustomers.length).toBe(1);
      expect(component.filteredCustomers[0].name).toBe('John Doe');
      expect(component.currentCustomerPage).toBe(1);
    });

    it('should search customers by email', () => {
      component.customerSearch = 'jane@example.com';
      component.searchCustomers();

      expect(component.filteredCustomers.length).toBe(1);
      expect(component.filteredCustomers[0].email).toBe('jane@example.com');
    });

    it('should filter customers by status', () => {
      component.customerFilter = 'Active';
      component.searchCustomers();

      expect(component.filteredCustomers.length).toBe(1);
      expect(component.filteredCustomers[0].status).toBe('Active');
    });

    it('should reset to first page when searching', () => {
      component.currentCustomerPage = 3;
      component.searchCustomers();

      expect(component.currentCustomerPage).toBe(1);
    });

    it('should open customer modal for viewing', () => {
      const customer = component.customers[0];
      component.viewCustomer(customer);

      expect(component.showViewModal).toBe(true);
      expect(component.viewModalTitle).toBe('Customer Details');
      expect(component.viewData).toEqual(customer);
    });

    it('should open customer modal for editing', () => {
      const customer = component.customers[0];
      component.editCustomer(customer);

      expect(component.showCustomerModal).toBe(true);
      expect(component.customerModalTitle).toBe('Edit Customer');
      expect(component.isEditMode).toBe(true);
      expect(component.customerFormData.name).toBe(customer.name);
    });
  });

  describe('Mechanic Management', () => {
    beforeEach(() => {
      component.mechanics = sampleMechanics.map(m => ({
        ...m,
        status: m.is_active ? 'Active' : 'Inactive' as 'Active' | 'Inactive'
      }));
      component.filteredMechanics = [...component.mechanics];
    });

    it('should load mechanics from backend successfully', () => {
      component.loadMechanicsFromBackend();

      expect(mockMechanicService.getAllMechanics).toHaveBeenCalled();
      expect(component.mechanics.length).toBe(2);
      expect(component.mechanics[0].status).toBe('Active');
      expect(component.mechanics[1].status).toBe('Inactive');
    });

    it('should handle mechanic loading error', () => {
      mockMechanicService.getAllMechanics.and.returnValue(throwError('Error'));
      spyOn(console, 'error');

      component.loadMechanicsFromBackend();

      expect(console.error).toHaveBeenCalledWith('Failed to load mechanics from backend', 'Error');
    });

    it('should search mechanics by name', () => {
      component.mechanicSearch = 'Ramanan';
      component.searchMechanics();

      expect(component.filteredMechanics.length).toBe(1);
      expect(component.filteredMechanics[0].name).toBe('Ramanan');
    });

    it('should search mechanics by specialization', () => {
      component.mechanicSearch = 'Engine';
      component.searchMechanics();

      expect(component.filteredMechanics.length).toBe(1);
      expect(component.filteredMechanics[0].specialization).toContain('Engine Repair');
    });

    it('should filter mechanics by status', () => {
      component.mechanicFilter = 'Active';
      component.searchMechanics();

      expect(component.filteredMechanics.length).toBe(1);
      expect(component.filteredMechanics[0].status).toBe('Active');
    });

    it('should open mechanic modal for adding', () => {
      component.openMechanicModal();

      expect(component.showMechanicModal).toBe(true);
      expect(component.mechanicModalTitle).toBe('Add Mechanic');
      expect(component.isEditMode).toBe(false);
      expect(component.mechanicFormData).toEqual({ status: 'Active' });
    });

    it('should open mechanic modal for viewing', () => {
      const mechanic = component.mechanics[0];
      component.viewMechanic(mechanic);

      expect(component.showViewModal).toBe(true);
      expect(component.viewModalTitle).toBe('Mechanic Details');
      expect(component.viewData).toEqual(mechanic);
    });

    it('should open mechanic modal for editing', () => {
      const mechanic = component.mechanics[0];
      component.editMechanic(mechanic);

      expect(component.showMechanicModal).toBe(true);
      expect(component.mechanicModalTitle).toBe('Edit Mechanic');
      expect(component.isEditMode).toBe(true);
      expect(component.mechanicFormData.name).toBe(mechanic.name);
    });

    it('should toggle specialization selection', () => {
      component.mechanicFormData = { specialization: ['Engine Repair'] };
      
      // Remove existing specialization
      component.toggleSpecialization('Engine Repair');
      expect(component.mechanicFormData.specialization).toEqual([]);
      
      // Add new specialization
      component.toggleSpecialization('Brake Systems');
      expect(component.mechanicFormData.specialization).toContain('Brake Systems');
    });

    it('should initialize specialization array if undefined', () => {
      component.mechanicFormData = {};
      component.toggleSpecialization('Engine Repair');

      expect(component.mechanicFormData.specialization).toEqual(['Engine Repair']);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      // Create enough items to test pagination
      component.filteredCustomers = new Array(25).fill(null).map((_, i) => ({
        id: `customer_${i}`,
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        phone: `123456789${i}`,
        address: `Address ${i}`,
        status: 'Active' as const,
        role: 'customer' as const,
        password: 'password',
        createdAt: new Date(),
        isActive: true
      }));

      component.filteredMechanics = new Array(25).fill(null).map((_, i) => ({
        id: `mechanic_${i}`,
        name: `Mechanic ${i}`,
        email: `mechanic${i}@example.com`,
        phone: `123456789${i}`,
        specialization: ['Engine Repair'],
        status: 'Active' as 'Active' | 'Inactive',
        role: 'mechanic' as const,
        experience: 5,
        certification: ['ASE Certified'],
        employeeId: `EMP00${i}`,
        createdAt: new Date(),
        isActive: true,
        password: 'password',
        address: ''
      }));
    });

    it('should calculate total pages correctly for customers', () => {
      const totalPages = component.getTotalPages('customer');
      expect(totalPages).toBe(3); // 25 items / 10 per page = 3 pages
    });

    it('should calculate total pages correctly for mechanics', () => {
      const totalPages = component.getTotalPages('mechanic');
      expect(totalPages).toBe(3); // 25 items / 10 per page = 3 pages
    });

    it('should generate correct page numbers', () => {
      const pageNumbers = component.getPageNumbers('customer');
      expect(pageNumbers).toEqual([1, 2, 3]);
    });

    it('should return correct page classes for current page', () => {
      component.currentCustomerPage = 2;
      expect(component.getPageClasses('customer', 2)).toContain('bg-primary text-white');
      expect(component.getPageClasses('customer', 1)).toContain('hover:bg-gray-100');
    });

    it('should go to specific customer page', () => {
      spyOn(component, 'updateCustomerPagination');
      component.goToPage('customer', 2);

      expect(component.currentCustomerPage).toBe(2);
      expect(component.updateCustomerPagination).toHaveBeenCalled();
    });

    it('should go to specific mechanic page', () => {
      spyOn(component, 'updateMechanicPagination');
      component.goToPage('mechanic', 2);

      expect(component.currentMechanicPage).toBe(2);
      expect(component.updateMechanicPagination).toHaveBeenCalled();
    });

    it('should update customer pagination correctly', () => {
      component.currentCustomerPage = 1;
      component.updateCustomerPagination();

      expect(component.paginatedCustomers.length).toBe(10);
      expect(component.paginatedCustomers[0].name).toBe('Customer 0');
    });

    it('should update mechanic pagination correctly', () => {
      component.currentMechanicPage = 1;
      component.updateMechanicPagination();

      expect(component.paginatedMechanics.length).toBe(10);
      expect(component.paginatedMechanics[0].name).toBe('Mechanic 0');
    });

    it('should navigate to next customer page', () => {
      component.currentCustomerPage = 1;
      spyOn(component, 'updateCustomerPagination');
      
      component.nextPage('customer');

      expect(component.currentCustomerPage).toBe(2);
      expect(component.updateCustomerPagination).toHaveBeenCalled();
    });

    it('should navigate to previous customer page', () => {
      component.currentCustomerPage = 2;
      spyOn(component, 'updateCustomerPagination');
      
      component.previousPage('customer');

      expect(component.currentCustomerPage).toBe(1);
      expect(component.updateCustomerPagination).toHaveBeenCalled();
    });

    it('should not go to previous page if already on first page', () => {
      component.currentCustomerPage = 1;
      const initialPage = component.currentCustomerPage;
      
      component.previousPage('customer');

      expect(component.currentCustomerPage).toBe(initialPage);
    });

    it('should not go to next page if already on last page', () => {
      component.currentCustomerPage = 3; // Last page
      const initialPage = component.currentCustomerPage;
      
      component.nextPage('customer');

      expect(component.currentCustomerPage).toBe(initialPage);
    });
  });

  describe('Modal Management', () => {
    it('should close customer modal', () => {
      component.showCustomerModal = true;
      component.closeCustomerModal();

      expect(component.showCustomerModal).toBe(false);
      expect(component.customerFormData).toEqual({});
      expect(component.isEditMode).toBe(false);
    });

    it('should close mechanic modal', () => {
      component.showMechanicModal = true;
      component.closeMechanicModal();

      expect(component.showMechanicModal).toBe(false);
      expect(component.mechanicFormData).toEqual({});
      expect(component.isEditMode).toBe(false);
    });

    it('should close view modal', () => {
      component.showViewModal = true;
      component.closeViewModal();

      expect(component.showViewModal).toBe(false);
      expect(component.viewData).toEqual({});
    });

    it('should close delete modal', () => {
      component.showDeleteModal = true;
      component.closeDeleteModal();

      expect(component.showDeleteModal).toBe(false);
      expect(component.deleteType).toBe('');
      expect(component.deleteId).toBe('');
    });
  });

  describe('Delete Operations', () => {
    it('should open delete modal for customer', () => {
      component.deleteUser('customer', 'customer_1');

      expect(component.showDeleteModal).toBe(true);
      expect(component.deleteType).toBe('customer');
      expect(component.deleteId).toBe('customer_1');
    });

    it('should open delete modal for mechanic', () => {
      component.deleteUser('mechanic', 'mechanic_1');

      expect(component.showDeleteModal).toBe(true);
      expect(component.deleteType).toBe('mechanic');
      expect(component.deleteId).toBe('mechanic_1');
    });
  });

  describe('Utility Methods', () => {
    it('should return correct status classes for active status', () => {
      const classes = component.getStatusClasses('Active');
      expect(classes).toContain('text-green-800');
      expect(classes).toContain('bg-green-100');
    });

    it('should return correct status classes for inactive status', () => {
      const classes = component.getStatusClasses('Inactive');
      expect(classes).toContain('text-red-800');
      expect(classes).toContain('bg-red-100');
    });

    it('should calculate start index correctly', () => {
      component.currentCustomerPage = 2;
      component.filteredCustomers = new Array(25).fill({});
      
      const startIndex = component.getStartIndex('customer');
      expect(startIndex).toBe(11); // (2-1) * 10 + 1
    });

    it('should calculate end index correctly', () => {
      component.currentCustomerPage = 2;
      component.filteredCustomers = new Array(25).fill({});
      
      const endIndex = component.getEndIndex('customer');
      expect(endIndex).toBe(20); // min(2 * 10, 25)
    });

    it('should calculate end index for last page correctly', () => {
      component.currentCustomerPage = 3;
      component.filteredCustomers = new Array(25).fill({});
      
      const endIndex = component.getEndIndex('customer');
      expect(endIndex).toBe(25); // min(3 * 10, 25)
    });
  });

  describe('Error Handling', () => {
    it('should handle mechanic service errors gracefully', () => {
      mockMechanicService.getAllMechanics.and.returnValue(throwError('Network Error'));
      spyOn(console, 'error');

      component.loadMechanicsFromBackend();

      expect(console.error).toHaveBeenCalledWith('Failed to load mechanics from backend', 'Network Error');
    });

    it('should handle auth service errors gracefully', async () => {
      mockAuthService.getAllCustomers.and.returnValue(Promise.reject('Network Error'));

      await component.loadCustomersFromBackend();

      expect(component.customers).toEqual([]);
      expect(component.filteredCustomers).toEqual([]);
      expect(component.paginatedCustomers).toEqual([]);
    });
  });

  describe('Component Template Integration', () => {
    it('should render component template', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      
      expect(compiled.querySelector('h2').textContent).toContain('User Management');
    });

    it('should show customers tab as active by default', () => {
      fixture.detectChanges();
      const customersTab = fixture.nativeElement.querySelector('button:first-of-type');
      
      expect(customersTab.textContent).toContain('Customers');
    });

    it('should switch to mechanics tab when clicked', () => {
      fixture.detectChanges();
      const mechanicsTab = fixture.nativeElement.querySelectorAll('button')[1];
      
      mechanicsTab.click();
      fixture.detectChanges();
      
      expect(component.activeTab).toBe('mechanics');
    });
  });
});