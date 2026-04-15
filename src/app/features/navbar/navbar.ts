import { Component,OnInit, HostListener, ElementRef  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthFacade } from '../auth/facade/auth.facade';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthUser } from '../../core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],       
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar  implements OnInit {
  
  profileDropdownOpen = false;
  currentUser: AuthUser | null = null;
  searchQuery = '';
  returnUrl = '';

  constructor(
    private authFacade: AuthFacade, 
    private router: Router, 
    private route: ActivatedRoute,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.authFacade.user$.subscribe(user => {
      this.currentUser = user;
    });
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/profile';
  }

  toggleProfileDropdown(event: any) {
    event.stopPropagation();
    this.profileDropdownOpen = !this.profileDropdownOpen;
    console.log('Profile dropdown state:', this.profileDropdownOpen);
  }

  closeDropdown() {
    this.profileDropdownOpen = false;
  }

  onDropdownClick(event: any) {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close dropdown if clicking anywhere outside the profile dropdown
    const clickedInside = this.el.nativeElement.querySelector('.profile-dropdown').contains(event.target);
    if (!clickedInside) {
      this.profileDropdownOpen = false;
    }
  }

  navigateToProfile() {
    this.profileDropdownOpen = false;
    this.router.navigate([this.returnUrl]);
  }

  navigateToSettings() {
     this.profileDropdownOpen = false;
    console.log('Navigate to settings');
  }

  logout() {
    this.authFacade.logout();
    this.profileDropdownOpen = false;
  }

  onSearch() {
    console.log('Search query:', this.searchQuery);
  }
}
