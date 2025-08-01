import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Service {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  services: Service[] = [
    {
      title: 'AC Service',
      description: 'Cooling system maintenance',
      image: 'assets/ac services.jpg'
    },
    {
      title: 'Battery Check',
      description: 'Complete battery diagnostics',
      image: 'assets/battery check.jpg'
    },
    {
      title: 'Brake Service',
      description: 'Pad replacement & maintenance',
      image: 'assets/brake services.jpg'
    },
    {
      title: 'Car Wash',
      description: 'Premium cleaning services',
      image: 'assets/car wash.jpg'
    },
    {
      title: 'Fuel Cleaning',
      description: 'Injector cleaning service',
      image: 'assets/fuel cleaning.jpg'
    },
    {
      title: 'Oil Service',
      description: 'Engine oil & filter change',
      image: 'assets/oil service.jpg'
    }
  ];
}
