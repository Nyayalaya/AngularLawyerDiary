import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],        // ✅ REQUIRED for ngModel
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  
  profileDropdownOpen: boolean = false;
  searchQuery: string = '';

  toggleProfileDropdown(): void {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  closeProfileDropdown(): void {
    this.profileDropdownOpen = false;
  }

  navigateToProfile(): void {
    console.log('Navigate to Profile');
    this.closeProfileDropdown();
  }

  navigateToSettings(): void {
    console.log('Navigate to Settings');
    this.closeProfileDropdown();
  }

  logout(): void {
    console.log('User logged out');
    alert('Logout functionality triggered');
    this.closeProfileDropdown();
  }

  onSearch(): void {
    console.log('Search query:', this.searchQuery);
  }
}
