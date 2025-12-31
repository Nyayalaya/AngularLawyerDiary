import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourtTypeModel } from '../../../core/models/court-type.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericFormContainer } from "../../../shared";
import { GenericTable } from '../../../shared';

@Component({
  selector: 'app-court-type',
  standalone: true,
  templateUrl: './court-type.html',
  styleUrl: './court-type.css',
  imports: [CommonModule,
    ReactiveFormsModule,
    GenericFormContainer, GenericTable],
})
export class CourtType {

  // Signals for UI
  showForm = signal(false);
  // Form
  courtTypeForm!: FormGroup;

  // Table data
  courtTypes = signal<CourtTypeModel[]>([
    { id: 1, name: 'Supreme Court', description: 'Highest authority' },
    { id: 2, name: 'High Court', description: 'State level court' },
  ]);

  columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Court Name' },
    { key: 'description', label: 'Description' },
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  initializeForm() {
    this.courtTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
    });
  }

  toggleForm() {
    this.showForm.update(v => !v);
    this.courtTypeForm.reset();
  }
  onSubmit() {
    if (this.courtTypeForm.valid) {
      const newCourt: CourtTypeModel = {
        id: Math.max(0, ...this.courtTypes().map(c => c.id)) + 1, // generate unique ID
        ...this.courtTypeForm.value
      };

      this.courtTypes.update(ct => [newCourt, ...ct]); // prepend to array
      alert('Court Type added successfully!');
      this.toggleForm();
    }
  }


  onEdit(row: CourtTypeModel) {
    this.courtTypeForm.patchValue(row);
    this.showForm.set(true);
  }

  onDelete(row: CourtTypeModel) {
    if (confirm('Are you sure you want to delete this court type?')) {
      this.courtTypes.update(ct => ct.filter(c => c.id !== row.id));
    }
  }

  onView(row: CourtTypeModel) {
    alert(`Viewing Court: ${row.name}\nDescription: ${row.description}`);
  }

}
