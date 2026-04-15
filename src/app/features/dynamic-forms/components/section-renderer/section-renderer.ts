import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldRenderer } from '../field-renderer/field-renderer';
import { FormGroup } from '@angular/forms';
import { FormSection } from '../../../../core/models/form-schema.model';

@Component({
  standalone: true,
  selector: 'app-section-renderer',
  imports: [CommonModule, FieldRenderer],
  templateUrl: './section-renderer.html'
})
export class SectionRenderer {

  section = input.required<FormSection>();
  group = input.required<FormGroup>();
  columns = input(1);

  get colClass() {
    return 'col-md-' + (12 / this.columns());
  }
}
