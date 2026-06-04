import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from '../../footer/footer/footer';
import { Sidebar } from '../../sidebar/sidebar/sidebar';
import { Navbar } from '../../navbar/navbar';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuService } from '../../../core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    Footer,
    Sidebar,
    Navbar
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  standalone: true
})
export class Layout {
  public title = 'law-admin';
  public sidebarOpen = true;
  public hideFooter: boolean = false;

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

    this.hideFooter = this.router.url.startsWith('/ai-assistant');
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideFooter = this.router.url.startsWith('/ai-assistant');
      });
  }
}
