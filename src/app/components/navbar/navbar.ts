import { Component,OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],        // ✅ REQUIRED for ngModel
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar  implements OnInit {
  
  profileDropdownOpen = false;
  currentUser: User | null = null;
  searchQuery = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    // Optional: subscribe to changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  navigateToProfile() {
    console.log('Navigate to profile');
  }

  navigateToSettings() {
    console.log('Navigate to settings');
  }

  logout() {
    this.authService.logout();
  }

  onSearch() {
    console.log('Search query:', this.searchQuery);
  }
}
