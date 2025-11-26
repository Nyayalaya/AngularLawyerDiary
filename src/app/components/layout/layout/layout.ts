import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from '../../login/login';
import { Header } from '../../header/header/header';
import { Footer } from '../../footer/footer/footer';
import { Sidebar } from '../../sidebar/sidebar/sidebar';
import { Dashboard } from '../../dashboard/dashboard';
import { Navbar } from '../../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { MenuService } from '../../../core';
@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet    
    , Footer
    , Sidebar    
    , Navbar
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  standalone: true
})
export class Layout {
title = 'law-admin';
  sidebarOpen: boolean = true;
  constructor(public menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.sidebarOpen$.subscribe(
      (isOpen: boolean) => {
        this.sidebarOpen = isOpen;
      }
    );
  }
}
