import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  hasSubmenu: boolean;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {  
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit {
   sidebarOpen: boolean = true;
  activeMenu: string = 'dashboard';
  activeSubmenu: string = '';
  expandedMenus: Set<string> = new Set();

  menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      route: '/home',
      hasSubmenu: false
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      hasSubmenu: false
    },
    {
      id: 'master',
      label: 'Master',
      icon: 'grid_view',
      route: '/master',
      hasSubmenu: true,
      submenu: [
        { label: 'Court Type', route: '/master/court-type' },
        { label: 'Court Master', route: '/master/court-master' },
        { label: 'Work', route: '/master/work' },
        { label: 'Work Type', route: '/master/work-type' }
      ]
    },
    {
      id: 'lawyer-admin',
      label: 'Lawyer Admin',
      icon: 'work',
      route: '/lawyer-admin',
      hasSubmenu: true,
      submenu: [
        { label: 'Client', route: '/lawyer-admin/client' },
        { label: 'Lawyer', route: '/lawyer-admin/lawyer' },
        { label: 'Associate', route: '/lawyer-admin/associate' }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: 'build',
      route: '/tools',
      hasSubmenu: false
    }
  ];

  constructor(
    public menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuService.sidebarOpen$.subscribe(
      (isOpen: boolean) => {
        this.sidebarOpen = isOpen;
      }
    );

    this.menuService.activeMenu$.subscribe(
      (menuId: string) => {
        this.activeMenu = menuId;
      }
    );

    // Set active menu based on current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveMenuFromRoute();
    });

    this.updateActiveMenuFromRoute();
  }

  updateActiveMenuFromRoute(): void {
    const currentUrl = this.router.url;
    
    if (currentUrl.includes('/home')) {
      this.menuService.setActiveMenu('home');
    } else if (currentUrl.includes('/dashboard')) {
      this.menuService.setActiveMenu('dashboard');
    } else if (currentUrl.includes('/master')) {
      this.menuService.setActiveMenu('master');
      this.expandedMenus.add('master');
    } else if (currentUrl.includes('/lawyer-admin')) {
      this.menuService.setActiveMenu('lawyer-admin');
      this.expandedMenus.add('lawyer-admin');
    } else if (currentUrl.includes('/tools')) {
      this.menuService.setActiveMenu('tools');
    }
  }

  onMenuClick(menuItem: MenuItem): void {
    this.menuService.setActiveMenu(menuItem.id);
    
    if (menuItem.hasSubmenu) {
     // Toggle submenu expansion
      if (this.expandedMenus.has(menuItem.id)) {
        this.expandedMenus.delete(menuItem.id);
      } else {
        this.expandedMenus.add(menuItem.id);
      }
    } else {
      this.router.navigate([menuItem.route]);
      this.activeSubmenu = '';
    }
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  }

  navigateToSubmenu(route: string): void {
     this.activeSubmenu = route;
    this.router.navigate([route]);
  }

  isSubmenuActive(route: string): boolean {
    return this.activeSubmenu === route || this.router.url === route;
  }


  toggleSidebar(): void {
    this.menuService.toggleSidebar();
  }
}