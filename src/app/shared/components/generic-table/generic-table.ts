// generic-table.component.ts
import {
  Component, Input, Output, EventEmitter,
  signal, computed, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionMenu } from '../action-menu/action-menu';
import { MinValPipe } from "../../pipes/min-val.pipe";

@Component({
  selector: 'app-generic-table',
  standalone: true,
  templateUrl: './generic-table.html',
  imports: [CommonModule, FormsModule, ActionMenu, MinValPipe]
})
export class GenericTable implements OnChanges {

  @Input() title    = '';
  @Input() data:    any[]  = [];
  @Input() columns: { key: string; label: string; hidden?: boolean; isKey?: boolean }[] = [];

  // ── Server-side pagination inputs ──────────────────────────────────
  @Input() serverSide    = false;   // flip to true for server paging
  @Input() totalRecords  = 0;
  @Input() currentPage   = 1;
  @Input() pageSize      = 10;
  @Input() totalPages    = 0;

  // ── Outputs ────────────────────────────────────────────────────────
  @Output() added       = new EventEmitter<void>();
  @Output() edit        = new EventEmitter<any>();
  @Output() delete      = new EventEmitter<any>();
  @Output() view        = new EventEmitter<any>();
  @Output() pageChanged = new EventEmitter<{ page: number; pageSize: number }>();

  // ── Internal client-side pagination ───────────────────────────────
  page       = signal(1);
  clientSize = signal(10);

  pageSizeOptions = [5, 10, 25, 50];
  searchTerm      = signal('');

  // ── Computed ───────────────────────────────────────────────────────
  visibleColumns = computed(() =>
    this.columns.filter(c => !c.hidden)
  );

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term || this.serverSide) return this.data;
    return this.data.filter(row =>
      this.visibleColumns().some(col =>
        String(row[col.key] ?? '').toLowerCase().includes(term)
      )
    );
  });

  // Client-side pagination (used when serverSide = false)
  clientTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredData().length / this.clientSize()))
  );

  paginatedData = computed(() => {
    if (this.serverSide) return this.data;  // server already returns sliced data
    const p    = this.page();
    const size = this.clientSize();
    return this.filteredData().slice((p - 1) * size, p * size);
  });

  // Unified getters for template — works for both modes
  get activePage():       number { return this.serverSide ? this.currentPage   : this.page();             }
  get activeTotalPages(): number { return this.serverSide ? this.totalPages     : this.clientTotalPages(); }
  get activeTotalRecs():  number { return this.serverSide ? this.totalRecords   : this.filteredData().length; }
  get activePageSize():   number { return this.serverSide ? this.pageSize       : this.clientSize();       }

  ngOnChanges(changes: SimpleChanges): void {
    // Reset to page 1 when data changes in client mode
    if (changes['data'] && !this.serverSide) {
      this.page.set(1);
    }
  }

  // ── Pagination actions ─────────────────────────────────────────────
  goFirst(): void {
    this.navigate(1);
  }

  goPrev(): void {
    if (this.activePage > 1) this.navigate(this.activePage - 1);
  }

  goNext(): void {
    if (this.activePage < this.activeTotalPages) this.navigate(this.activePage + 1);
  }

  goLast(): void {
    this.navigate(this.activeTotalPages);
  }

  goToPage(p: number): void {
    this.navigate(p);
  }

  onPageSizeChange(event: Event): void {
    const size = +(event.target as HTMLSelectElement).value;
    if (this.serverSide) {
      this.pageChanged.emit({ page: 1, pageSize: size });
    } else {
      this.clientSize.set(size);
      this.page.set(1);
    }
  }

  private navigate(p: number): void {
    if (this.serverSide) {
      this.pageChanged.emit({ page: p, pageSize: this.pageSize });
    } else {
      this.page.set(p);
    }
  }

  // ── Page number pills with ellipsis ───────────────────────────────
  getPageNumbers(): (number | '...')[] {
    const total   = this.activeTotalPages;
    const current = this.activePage;
    const delta   = 2;
    const pages: (number | '...')[] = [];

    const start = Math.max(1, current - delta);
    const end   = Math.min(total, current + delta);

    if (start > 1)     { pages.push(1);     if (start > 2) pages.push('...'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total)   { if (end < total - 1) pages.push('...'); pages.push(total); }

    return pages;
  }

  getSerialNumber(index: number): number {
    return (this.activePage - 1) * this.activePageSize + index + 1;
  }

  exportCSV(): void {
    const headers = this.visibleColumns().map(c => c.label).join(',');
    const rows    = this.data.map(row =>
      this.visibleColumns().map(c => `"${row[c.key] ?? ''}"`).join(',')
    );
    const csv  = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${this.title || 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  onAddClick(): void {
    this.added.emit();
  }
}