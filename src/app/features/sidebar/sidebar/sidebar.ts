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
   roles?: string[];
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
  filteredMenuItems: MenuItem[] = [];
  userRole: string = '';

  menuItems: MenuItem[] = [
    
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      hasSubmenu: false
    },
    // {
    //   id: 'manage-master',
    //   label: 'Manage Master',
    //   icon: 'grid_view',
    //   route: '/manage-master',
    //   hasSubmenu: true,
    //   submenu:[
    //      { label: 'Master Category', route: '/manage-master/master-category' },
    //      { label: 'Dynamic Form Builder', route: '/manage-master/form-builder' }
    //   ]
    // },
    {
      id: 'master',
      label: 'Master',
      icon: 'grid_view',
      route: '/master',
      hasSubmenu: true,
      roles: ['SuperAdmin'],
      submenu: [
        { label: 'State', route: '/master/state' },
        { label: 'Court Level', route: '/master/court-level' },
        { label: 'Type of Court', route: '/master/court-type' },
        { label: 'Case categories', route: '/master/case-category' },
        { label: 'Case stages', route: '/master/case-stage' },
        { label: 'Court District', route: '/master/court-district' },
        { label: 'Cadre', route: '/master/cadre' },
       
        { label: 'Court Complex', route: '/master/court-master' },
        { label: 'Courts', route: '/master/court-master' },
        { label: 'Proceeding Type', route: '/master/work' },
        { label: 'Proceeding', route: '/master/work-type' },
        { label: 'Work Type', route: '/master/work' },
        { label: 'Work', route: '/master/work-type' },
        { label: 'Draft & Order', route: '/master/work-type' },
        { label: 'Appearences', route: '/master/work-type' },
      ]
    },
    {
      id: 'diary-drafting-master',
      label: 'Drafting Master',
      icon: 'work',
      route: '/diary-drafting-master',
      hasSubmenu: true,
      roles: ['SuperAdmin'],
      submenu: [
        { label: 'Form Type', route: '/master/work-type' },
        { label: 'Form Builder', route: '/lawyer-admin/lawyer' },
        { label: 'Form Template', route: '/lawyer-admin/associate' }
      ]
    },
    {
      id: 'lawyer-admin',
      label: 'Lawyer Admin',
      icon: 'work',
      route: '/lawyer-admin',
      hasSubmenu: true,
      roles: ['SuperAdmin', 'Admin'],
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
      hasSubmenu: false,
      roles: ['SuperAdmin', 'Admin'],
    }
  ];

  constructor(
    public menuService: MenuService,
    private router: Router
  ) {}

  filterMenuByRole(): void {
  this.filteredMenuItems = this.menuItems.filter(menu => {
    if (!menu.roles) return true; // no restriction
    return menu.roles.includes(this.userRole);
  });
}

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