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
  route?: string;       // ✅ optional (for divider)
  isDivider?: boolean;
  children?: SubMenuItem[]; // optional 3rd-level "child" tree
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit {

  sidebarOpen = true;
  activeMenu = 'dashboard';
  activeSubmenu = '';
  expandedMenus = new Set<string>();
  expandedSubmenuGroups = new Set<string>();
  userRole = 'SuperAdmin'; 
  filteredMenuItems: MenuItem[] = [];

  // ✅ MENU CONFIG
  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      hasSubmenu: false
    },
    {
      id: 'system-overview',
      label: 'System Overview',
      icon: 'insights',
      route: '/system-overview',
      hasSubmenu: false
    },
    {
      id: 'activity-log',
      label: 'Activity Log',
      icon: 'history',
      route: '/activity-log',
      hasSubmenu: false
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'bar_chart',
      route: '/analytics',
      hasSubmenu: false
    },
    {
      id: 'master',
      label: 'Master Management',
      icon: 'grid_view',
      route: '/master',
      hasSubmenu: true,
      roles: ['SuperAdmin'],
      submenu: [
        { label: 'State', route: '/master/state' },
        { label: 'Cadre', route: '/master/cadre' },
        { label: 'Case Categories', route: '/master/case-category' },
        { label: 'Case Stages', route: '/master/case-stage' },

        // { label: '───── Court ─────', isDivider: true },
        { label: 'Court Level', route: '/master/court-level' },
        { label: 'Type of Court', route: '/master/court-type' },
        { label: 'Court District', route: '/master/court-district' },
        { label: 'Courts', route: '/master/court' },
        { label: 'Court Complex', route: '/master/court-complex' },

        // { label: '───── Forms ─────', isDivider: true },
        { label: 'Form Type', route: '/master/form-type' },
        { label: 'Form Master', route: '/master/form-master' },
        { label: 'Form SubType', route: '/master/form-subtype' },
        { label: 'Form Template', route: '/master/form-template' },

        // { label: '───── Proceeding & Work ─────', isDivider: true },
        { label: 'Proceeding Type', route: '/master/proceeding-type' },
        { label: 'Proceeding', route: '/master/proceeding' },
        { label: 'Work Type', route: '/master/work-type' },
        { label: 'Work', route: '/master/work' },
        { label: 'Draft & Order', route: '/master/draft-order' },
        { label: 'Appearances', route: '/master/appearances' }
      ]
    }
    ,
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
        { label: 'Associate', route: '/lawyer-admin/associate' },
        { label: 'Roles & Permissions', route: '/lawyer-admin/roles-permissions' }
      ]
    },

    {
      id: 'case-management',
      label: 'Case Management',
      icon: 'gavel',
      route: '/case-management',
      hasSubmenu: true,
      roles: ['SuperAdmin', 'Admin'],
      submenu: [
        { label: 'Manage Case', route: '/case-management/case-manage' }
      ]
    },

    {
      id: 'tools',
      label: 'Tools',
      icon: 'build',
      route: '/tools',
      hasSubmenu: true,
      roles: ['SuperAdmin', 'Admin'],
       submenu: [
        { label: 'Ad Valorem Fee', route: '/tools/settings' },
        { label: 'Court Fee', route: '/system-settings/settings' },
        { label: 'Limitation Period', route: '/system-settings/feature-management' },
        { label: 'MACT Compensation', route: '/system-settings/subscriptions' },
        { label: 'Interest ', route: '/system-settings/notification-settings' },
        { label: 'Stamp Duty ', route: '/system-settings/integration' },
        { label: 'Court Working Days', route: '/system-settings/integration' },
        { label: 'Advocate Fee', route: '/system-settings/integration' },
        { label: 'Compensation & Damages', route: '/system-settings/integration' },
        { label: 'Compensation & Damages', route: '/system-settings/integration' },
      ]
    },

    {
      id: 'system-management',
      label: 'System Management',
      icon: 'settings',
      route: '/system-management',
      hasSubmenu: true,
      roles: ['SuperAdmin', 'Admin'],
      submenu: [
        { label: 'System settings', route: '/system-settings/settings' },
        { label: 'System Users', route: '/system-settings/system-users' },
        { label: 'Roles & Permissions', route: '/system-settings/roles-permissions' },
        { label: 'Feature management', route: '/system-settings/feature-management' },
        { label: 'Subscriptions & plans', route: '/system-settings/subscriptions' },
        { label: 'Notification Settings', route: '/system-settings/notification-settings' },
        { label: 'Integration', route: '/system-settings/integration' },
      ]
    }
  ];

  constructor(
    public menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filterMenuByRole();

    this.menuService.sidebarOpen$.subscribe(v => this.sidebarOpen = v);
    this.menuService.activeMenu$.subscribe(v => this.activeMenu = v);

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.updateActiveMenuFromRoute());

    this.updateActiveMenuFromRoute();
  }

  // ✅ ROLE FILTER
  filterMenuByRole(): void {
    this.filteredMenuItems = this.menuItems.filter(menu =>
      !menu.roles || menu.roles.includes(this.userRole)
    );
  }

  // ✅ ROUTE MATCHING
  updateActiveMenuFromRoute(): void {
  const url = this.router.url;

    // Keep sidebar state aligned with the current URL
    this.expandedMenus.clear();
    this.expandedSubmenuGroups.clear();
    this.activeSubmenu = '';

    for (const menu of this.filteredMenuItems) {
      if (this.isRouteMatch(url, menu.route)) {
        this.menuService.setActiveMenu(menu.id);
        this.expandedMenus.add(menu.id);

        if (menu.hasSubmenu) {
          const match = this.findActiveSubmenuInMenu(menu, url);
          this.activeSubmenu = match.activeRoute;
          match.expandedGroupIds.forEach(id => this.expandedSubmenuGroups.add(id));
        }

        break;
      }
    }
  }



  onMenuClick(menu: MenuItem): void {
    this.menuService.setActiveMenu(menu.id);

    if (!menu.hasSubmenu) {
      this.expandedMenus.clear();
      this.expandedSubmenuGroups.clear();
      this.router.navigate([menu.route]);
      this.activeSubmenu = '';
      return;
    }

    if (this.expandedMenus.has(menu.id)) {
      this.expandedMenus.delete(menu.id);
      this.activeSubmenu = '';
      this.collapseSubmenuGroupsForMenu(menu.id);
      return;
    }

    this.expandedMenus.clear();
    this.expandedMenus.add(menu.id);
    this.expandedSubmenuGroups.clear();

    // If we're currently on a submenu route, auto-expand the matching subtree
    const match = this.findActiveSubmenuInMenu(menu, this.router.url);
    this.activeSubmenu = match.activeRoute;
    match.expandedGroupIds.forEach(id => this.expandedSubmenuGroups.add(id));
  }

  navigateToSubmenu(route?: string): void {
    if (!route) return;

    this.activeSubmenu = route;
    this.router.navigate([route]);
  }

  isMenuExpanded(id: string): boolean {
    return this.expandedMenus.has(id);
  }

  isSubmenuActive(route?: string): boolean {
    return route ? this.isRouteMatch(this.router.url, route) : false;
  }

  onSubmenuGroupClick(menuId: string, sub: SubMenuItem): void {
    const key = this.submenuGroupKey(menuId, sub);

    // Toggle nested group visibility
    if (this.expandedSubmenuGroups.has(key)) {
      this.expandedSubmenuGroups.delete(key);
    } else {
      this.expandedSubmenuGroups.add(key);
    }

    // If this node itself is navigable, also navigate
    if (sub.route) {
      this.navigateToSubmenu(sub.route);
    }
  }

  isSubmenuGroupExpanded(menuId: string, sub: SubMenuItem): boolean {
    return this.expandedSubmenuGroups.has(this.submenuGroupKey(menuId, sub));
  }

  isAnyChildActive(children?: SubMenuItem[]): boolean {
    if (!children?.length) return false;
    const url = this.router.url;
    return children.some(ch => !ch.isDivider && this.isRouteMatch(url, ch.route));
  }

  private submenuGroupKey(menuId: string, sub: SubMenuItem): string {
    return `${menuId}:${sub.route ?? sub.label}`;
  }

  private collapseSubmenuGroupsForMenu(menuId: string): void {
    const prefix = `${menuId}:`;
    for (const key of Array.from(this.expandedSubmenuGroups)) {
      if (key.startsWith(prefix)) this.expandedSubmenuGroups.delete(key);
    }
  }

  private isRouteMatch(url: string, route?: string): boolean {
    if (!route) return false;
    return url === route || url.startsWith(route + '/');
  }

  private findActiveSubmenuInMenu(menu: MenuItem, url: string): {
    activeRoute: string;
    expandedGroupIds: string[];
  } {
    const submenu = menu.submenu ?? [];

    for (const sub of submenu) {
      if (sub.isDivider) continue;

      // Leaf item match
      if (this.isRouteMatch(url, sub.route)) {
        const expandedGroupIds = sub.children?.length ? [this.submenuGroupKey(menu.id, sub)] : [];
        return { activeRoute: sub.route ?? '', expandedGroupIds };
      }

      // 3rd-level "child" match
      if (sub.children?.length) {
        const matchedChild = sub.children.find(ch => !ch.isDivider && this.isRouteMatch(url, ch.route));
        if (matchedChild?.route) {
          return {
            activeRoute: matchedChild.route,
            expandedGroupIds: [this.submenuGroupKey(menu.id, sub)],
          };
        }
      }
    }

    return { activeRoute: '', expandedGroupIds: [] };
  }

  getCleanLabel(label: string): string {
    return label.replace(/─/g, '').trim();
  }

  toggleSidebar(): void {
    this.menuService.toggleSidebar();
  }
}
