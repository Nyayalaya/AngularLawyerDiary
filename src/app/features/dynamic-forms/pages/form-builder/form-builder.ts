import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormSchema } from '../../../../core/models/form-schema.model';
import { FormRendererComponent } from '../../components/form-render/form-render';
import { SectionEditor } from '../../components/section-editor/section-editor';

@Component({
  standalone: true,
  selector: 'app-form-builder',
  imports: [
    CommonModule,
    FormsModule,
    SectionEditor,
    FormRendererComponent
  ],
  templateUrl: './form-builder.html'
})
export class FormBuilderPage {

  schema = signal<FormSchema>(this.createEmpty());

  // =========================
  // Create blank schema
  // =========================
  createEmpty(): FormSchema {
    return {
      id: crypto.randomUUID(),
      name: 'New Form',
      menuLabel: 'New Form',
      icon: 'description',
      columns: 2,
      sections: [],
      grids: []
    };
  }

  // =========================
  addSection() {
    this.schema().sections.push({
      title: 'New Section',
      fields: []
    });
  }

  removeSection(i: number) {
    this.schema().sections.splice(i, 1);
  }

  // =========================
  exportJson() {
    const data = JSON.stringify(this.schema(), null, 2);

    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.schema().id}-form.json`;
    a.click();
  }

  // =========================
  saveLocal() {
    const all = JSON.parse(localStorage.getItem('forms') || '[]');

    const idx = all.findIndex((x: any) => x.id === this.schema().id);

    if (idx >= 0) all[idx] = this.schema();
    else all.push(this.schema());

    localStorage.setItem('forms', JSON.stringify(all));

    alert('Saved locally ✔');
  }

  reset() {
    this.schema.set(this.createEmpty());
  }
}
