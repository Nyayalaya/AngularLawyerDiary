import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGrid } from '../../../../core/models/form-schema.model';

@Component({
  standalone: true,
  selector: 'app-grid-renderer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './grid-renderer.html'
})
export class GridRenderer {

  private fb = inject(FormBuilder);

  grid = input.required<FormGrid>();
  group = input.required<FormGroup>();

  get array(): FormArray {
    return this.group().get(this.grid().name) as FormArray;
  }

  addRow() {
    const row: any = {};
    this.grid().columns.forEach(c => row[c.name] = ['']);
    this.array.push(this.fb.group(row));
  }

  removeRow(i: number) {
    this.array.removeAt(i);
  }
}
