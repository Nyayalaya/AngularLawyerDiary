import { Component, inject, OnInit, signal } from '@angular/core';
import { StateFacade } from '../../facade/state.facade';
import { GenericTable } from '../../../../shared';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-state-view',
  imports: [
    CommonModule,
    GenericTable
  ],
  templateUrl: './state-view.html',
  styleUrl: './state-view.css',
})
export class StateView implements OnInit {
  
  // ── DI ────────────────────────────────────────────────────────────
  private facade = inject(StateFacade);

  // ── Store streams ─────────────────────────────────────────────────
  states$       = this.facade.states$;
  loading$      = this.facade.loading$;
  error$        = this.facade.error$;
  totalRecords$ = this.facade.totalRecords$;
  pageNumber$   = this.facade.pageNumber$;
  pageSize$     = this.facade.pageSize$;
  totalPages$   = this.facade.totalPages$;

    // ── Local UI state ────────────────────────────────────────────────
  showForm    = signal(false);
  currentPage = signal(1);
  pageSize    = signal(10);
  

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id',           label: 'ID',           hidden: true, isKey: true },
    { key: 'name',    label: 'Name'                               },
    { key: 'code', label: 'Code'                             }
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadPage();
  }

  // ── Pagination ────────────────────────────────────────────────────
  loadPage(): void {
    this.facade.load(this.currentPage(), this.pageSize());
  }

  onPageChanged(event: { page: number; pageSize: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
    this.facade.load(event.page, event.pageSize, true);
  }

}
