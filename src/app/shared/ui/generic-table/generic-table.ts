import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionMenu } from '../action-menu/action-menu';


export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ActionMenu],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.css',
})
export class GenericTable {
/** Columns config */
  @Input() columns: TableColumn[] = [];

  /** Table data */
  @Input() data: any[] = [];

  /** Action callbacks */
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  /** Pagination signals */
  page = signal(1);
  pageSize = signal(5);

  /** Search signal */
  searchTerm = signal('');

  /** Computed filtered data */
  filteredData = computed(() => {
    const term = this.searchTerm();
    return this.data.filter(item =>
      Object.values(item).some(v =>
        v?.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
  });

  /** Computed paginated data */
  paginatedData = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredData().slice(start, end);
  });

  /** Total pages */
  totalPages = computed(() => {
    return Math.ceil(this.filteredData().length / this.pageSize());
  });

  /** Pagination controls */
  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) this.page.set(p);
  }

  nextPage() { this.goToPage(this.page() + 1); }
  prevPage() { this.goToPage(this.page() - 1); }

  /** Export CSV */
  exportCSV(filename: string = 'export.csv') {
    const csvRows = [];
    const headers = this.columns.map(c => `"${c.label}"`).join(',');
    csvRows.push(headers);
    for (const row of this.filteredData()) {
      const values = this.columns.map(c => `"${row[c.key] ?? ''}"`).join(',');
      csvRows.push(values);
    }
    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
