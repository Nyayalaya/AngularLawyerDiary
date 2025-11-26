import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private sidebarOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public sidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

  private activeMenuSubject: BehaviorSubject<string> = new BehaviorSubject<string>('dashboard');
  public activeMenu$: Observable<string> = this.activeMenuSubject.asObservable();

  constructor() {}

  toggleSidebar(): void {
    const currentState = this.sidebarOpenSubject.value;
    this.sidebarOpenSubject.next(!currentState);
  }

  openSidebar(): void {
    this.sidebarOpenSubject.next(true);
  }

  closeSidebar(): void {
    this.sidebarOpenSubject.next(false);
  }

  setActiveMenu(menuId: string): void {
    this.activeMenuSubject.next(menuId);
    this.openSidebar();
  }

  getActiveMenu(): string {
    return this.activeMenuSubject.value;
  }

  isSidebarOpen(): boolean {
    return this.sidebarOpenSubject.value;
  }
}