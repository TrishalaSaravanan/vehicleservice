import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  onSubmit() {
    // Validate form
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      // Show error toast
      this.showToast('Please fill all required fields correctly', true);
      return;
    }

    // Here you would typically send the form data to your backend
    console.log('Form submitted:', this.contactForm);
    
    // Show success toast
    this.showToast('Message sent successfully!', false);
    
    // Reset form
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }

  private showToast(message: string, isError: boolean) {
    // Create and show toast element
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''} show`;
    toast.innerHTML = `
      <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
      <span>${message}</span>
    `;
    
    // Add toast styles
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${isError ? '#f44336' : '#4CAF50'};
      color: white;
      padding: 16px;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 1;
      transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  }
}
