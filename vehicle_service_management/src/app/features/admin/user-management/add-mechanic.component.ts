import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-mechanic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-mechanic.component.html',
  styleUrls: ['./add-mechanic.component.css']
})
export class AddMechanicComponent {
  mechanicData = {
    name: '',
    phone: '',
    address: '',
    experience: 0,
    certifications: [''],
    specializations: [''],
    email: '',
    password: ''
  };

  addCertification() {
    this.mechanicData.certifications.push('');
  }

  removeCertification(index: number) {
    this.mechanicData.certifications.splice(index, 1);
  }

  addSpecialization() {
    this.mechanicData.specializations.push('');
  }

  removeSpecialization(index: number) {
    this.mechanicData.specializations.splice(index, 1);
  }

  onSubmit() {
    console.log('Mechanic payload:', this.mechanicData);
    // TODO: Send to backend when ready
    alert('Mechanic details collected!');
  }
}
