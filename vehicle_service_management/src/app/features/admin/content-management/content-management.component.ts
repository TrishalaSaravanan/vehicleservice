import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WebsiteContent {
  home: {
    heroImage: string;
    heading: string;
    paragraph: string;
  };
  about: {
    image: string;
    paragraph: string;
  };
  services: Array<{
    id: number;
    image: string;
    description: string;
  }>;
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  footer: {
    address: string;
    phone: string;
    email: string;
    copyright: string;
  };
}

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-800">Content Management</h2>
          <p class="text-gray-600">Update website content and images</p>
        </div>
      </div>
      
      <!-- Content Tabs -->
      <div class="flex mb-6 border-b bg-white rounded-t-xl shadow-sm">
        <button *ngFor="let tab of contentTabs" 
                (click)="showSection(tab.key)"
                [class]="getTabClasses(tab.key)"
                class="px-6 py-3 font-medium border-b-2 border-transparent hover:text-primary transition">
          <i [class]="tab.icon + ' mr-2'"></i>{{tab.label}}
        </button>
      </div>
      
      <!-- Home Page Content -->
      <div *ngIf="currentSection === 'home'" class="content-section bg-white rounded-xl shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">Home Page Content</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Hero Image</label>
              <img [src]="websiteContent.home.heroImage || 'assets/hero-bg.jpg'" 
                   alt="Current Home Image" 
                   class="w-full h-64 object-cover rounded-lg border">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Upload New Hero Image</label>
              <input type="file" 
                     (change)="onImageSelect($event, 'home')" 
                     class="w-full border rounded p-2" 
                     accept="image/*">
            </div>
          </div>
          <div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Heading</label>
              <input type="text" 
                     [(ngModel)]="websiteContent.home.heading" 
                     class="w-full border rounded p-2">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Paragraph</label>
              <textarea [(ngModel)]="websiteContent.home.paragraph" 
                        class="w-full border rounded p-2 h-32"></textarea>
            </div>
            <button (click)="updateHomeContent()" 
                    class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Update Home Content
            </button>
          </div>
        </div>
      </div>
      
      <!-- About Page Content -->
      <div *ngIf="currentSection === 'about'" class="content-section bg-white rounded-xl shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">About Page Content</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Current About Image</label>
              <img [src]="websiteContent.about.image || 'assets/about.jpg'" 
                   alt="Current About Image" 
                   class="w-full h-64 object-cover rounded-lg border">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Upload New About Image</label>
              <input type="file" 
                     (change)="onImageSelect($event, 'about')" 
                     class="w-full border rounded p-2" 
                     accept="image/*">
            </div>
          </div>
          <div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">About Text</label>
              <textarea [(ngModel)]="websiteContent.about.paragraph" 
                        class="w-full border rounded p-2 h-48"></textarea>
            </div>
            <button (click)="updateAboutContent()" 
                    class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Update About Content
            </button>
          </div>
        </div>
      </div>
      
      <!-- Services Content -->
      <div *ngIf="currentSection === 'services'" class="content-section bg-white rounded-xl shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">Services Content</h3>
        <p class="text-gray-600 mb-4">Update service images and descriptions</p>
        
        <div class="space-y-6">
          <div *ngFor="let service of websiteContent.services" 
               class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="w-full md:w-1/3">
                <img [src]="service.image || getDefaultServiceImage(service.id)" 
                     [alt]="'Service ' + service.id" 
                     class="w-full h-48 object-cover rounded-lg">
                <input type="file" 
                       (change)="onServiceImageSelect($event, service.id)" 
                       class="mt-2 w-full border rounded p-1" 
                       accept="image/*">
              </div>
              <div class="w-full md:w-2/3">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
                  <textarea [(ngModel)]="service.description" 
                            class="w-full border rounded p-2 h-24"></textarea>
                </div>
                <button (click)="updateService(service.id)" 
                        class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                  Update Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Contact Page Content -->
      <div *ngIf="currentSection === 'contact'" class="content-section bg-white rounded-xl shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">Contact Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea [(ngModel)]="websiteContent.contact.address" 
                        class="w-full border rounded p-2 h-20"></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="text" 
                     [(ngModel)]="websiteContent.contact.phone" 
                     class="w-full border rounded p-2">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" 
                     [(ngModel)]="websiteContent.contact.email" 
                     class="w-full border rounded p-2">
            </div>
            <button (click)="updateContactContent()" 
                    class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Update Contact Info
            </button>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium mb-2">Preview:</h4>
            <p><strong>Address:</strong> {{websiteContent.contact.address}}</p>
            <p class="mt-2"><strong>Phone:</strong> {{websiteContent.contact.phone}}</p>
            <p class="mt-2"><strong>Email:</strong> {{websiteContent.contact.email}}</p>
          </div>
        </div>
      </div>
      
      <!-- Footer Content -->
      <div *ngIf="currentSection === 'footer'" class="content-section bg-white rounded-xl shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">Footer Content</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea [(ngModel)]="websiteContent.footer.address" 
                        class="w-full border rounded p-2 h-20"></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="text" 
                     [(ngModel)]="websiteContent.footer.phone" 
                     class="w-full border rounded p-2">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" 
                     [(ngModel)]="websiteContent.footer.email" 
                     class="w-full border rounded p-2">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
              <input type="text" 
                     [(ngModel)]="websiteContent.footer.copyright" 
                     class="w-full border rounded p-2">
            </div>
            <button (click)="updateFooterContent()" 
                    class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Update Footer Content
            </button>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium mb-2">Preview:</h4>
            <p><strong>Address:</strong> {{websiteContent.footer.address}}</p>
            <p class="mt-2"><strong>Phone:</strong> {{websiteContent.footer.phone}}</p>
            <p class="mt-2"><strong>Email:</strong> {{websiteContent.footer.email}}</p>
            <p class="mt-2 text-sm text-gray-500">{{websiteContent.footer.copyright}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #1B4B88;
    }
    .content-card {
      transition: all 0.3s ease;
    }
    .content-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .tab-active {
      border-bottom-color: var(--primary) !important;
      color: var(--primary) !important;
    }
  `]
})
export class ContentManagementComponent implements OnInit {
  currentSection = 'home';
  
  contentTabs = [
    { key: 'home', label: 'Home Page', icon: 'fas fa-home' },
    { key: 'about', label: 'About Page', icon: 'fas fa-info-circle' },
    { key: 'services', label: 'Services', icon: 'fas fa-tools' },
    { key: 'contact', label: 'Contact', icon: 'fas fa-address-book' },
    { key: 'footer', label: 'Footer', icon: 'fas fa-shoe-prints' }
  ];

  websiteContent: WebsiteContent = {
    home: {
      heroImage: "",
      heading: "Premium Vehicle Service & Maintenance",
      paragraph: "We provide top-quality vehicle service with certified mechanics and state-of-the-art equipment to keep your vehicle running smoothly."
    },
    about: {
      image: "",
      paragraph: "Founded in 2010, our service center has been providing exceptional automotive care with a team of experienced technicians committed to quality service."
    },
    services: [
      {
        id: 1,
        image: "",
        description: "Complete engine diagnostics and repair services"
      },
      {
        id: 2,
        image: "",
        description: "Brake system inspection and maintenance"
      },
      {
        id: 3,
        image: "",
        description: "Transmission service and fluid changes"
      },
      {
        id: 4,
        image: "",
        description: "Electrical system diagnostics and repair"
      },
      {
        id: 5,
        image: "",
        description: "Tire rotation and wheel alignment"
      },
      {
        id: 6,
        image: "",
        description: "Air conditioning system service"
      },
      {
        id: 7,
        image: "",
        description: "Complete vehicle detailing and cleaning"
      }
    ],
    contact: {
      address: "123 Auto Service Lane, Mechanicville, NY 12118",
      phone: "+1 (555) 123-4567",
      email: "contact@vehicleservice.com"
    },
    footer: {
      address: "123 Auto Service Lane, Mechanicville, NY 12118",
      phone: "+1 (555) 123-4567",
      email: "contact@vehicleservice.com",
      copyright: "© 2023 Vehicle Service Management. All rights reserved."
    }
  };

  ngOnInit(): void {
    this.loadContent();
  }

  showSection(section: string): void {
    this.currentSection = section;
  }

  getTabClasses(tabKey: string): string {
    return this.currentSection === tabKey ? 'tab-active border-b-2 border-primary text-primary' : '';
  }

  loadContent(): void {
    // In a real application, this would load from a backend service
    const savedContent = localStorage.getItem('websiteContent');
    if (savedContent) {
      this.websiteContent = JSON.parse(savedContent);
    }
  }

  saveContent(): void {
    // In a real application, this would save to a backend service
    localStorage.setItem('websiteContent', JSON.stringify(this.websiteContent));
  }

  onImageSelect(event: any, section: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (section === 'home') {
          this.websiteContent.home.heroImage = e.target.result;
        } else if (section === 'about') {
          this.websiteContent.about.image = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onServiceImageSelect(event: any, serviceId: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const serviceIndex = this.websiteContent.services.findIndex(s => s.id === serviceId);
        if (serviceIndex !== -1) {
          this.websiteContent.services[serviceIndex].image = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  getDefaultServiceImage(serviceId: number): string {
    const serviceImages = [
      'assets/oil service.jpg',
      'assets/brake services.jpg',
      'assets/ac services.jpg',
      'assets/battery check.jpg',
      'assets/tire services.jpg',
      'assets/fuel cleaning.jpg',
      'assets/car wash.jpg'
    ];
    return serviceImages[serviceId - 1] || 'assets/oil service.jpg';
  }

  updateHomeContent(): void {
    this.saveContent();
    alert('Home page content updated successfully!');
  }

  updateAboutContent(): void {
    this.saveContent();
    alert('About page content updated successfully!');
  }

  updateService(serviceId: number): void {
    this.saveContent();
    alert('Service updated successfully!');
  }

  updateContactContent(): void {
    this.saveContent();
    alert('Contact information updated successfully!');
  }

  updateFooterContent(): void {
    this.saveContent();
    alert('Footer content updated successfully!');
  }
}
