import {
  Component,
  Input,
  OnInit,
  signal,
  effect
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  ReactiveFormsModule
} from '@angular/forms';

import { FieldSchema, FormSchema } from '../../../../core/models/form-schema.model';
import { SectionRenderer } from "../section-renderer/section-renderer";
import { GridRenderer } from "../grid-renderer/grid-renderer";
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-form-renderer',
  templateUrl: './form-render.html',
  imports: [SectionRenderer, GridRenderer,CommonModule,
    ReactiveFormsModule]
})
export class FormRendererComponent implements OnInit {

  @Input() schema!: FormSchema;

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  // ======================================================
  // MAIN FORM BUILDER
  // ======================================================

  private buildForm() {

    const group: any = {};

    for (const section of this.schema.sections) {
      for (const field of section.fields) {
        group[field.name] = this.createControl(field);
      }
    }

    // grids (optional)
    for (const grid of this.schema.grids ?? []) {
      group[grid.name] = this.fb.array([]);
    }

    this.form = this.fb.group(group);
  }

  // ======================================================
  // CREATE CONTROL RECURSIVELY
  // ======================================================

  private createControl(field: FieldSchema): any {

    // GROUP
    if (field.type === 'group') {
      const childGroup: any = {};

      for (const child of field.children ?? []) {
        childGroup[child.name] = this.createControl(child);
      }

      return this.fb.group(childGroup);
    }

    // ARRAY (repeatable)
    if (field.type === 'array') {
      return this.fb.array([]);
    }

    // NORMAL FIELD
    return new FormControl(
      field.defaultValue ?? null,
      this.buildValidators(field)
    );
  }

  // ======================================================
  // VALIDATIONS
  // ======================================================

  private buildValidators(field: FieldSchema) {

    const rules: any[] = [];

    for (const v of field.validations ?? []) {

      switch (v.type) {

        case 'required':
          rules.push(Validators.required);
          break;

        case 'min':
          rules.push(Validators.min(v.value));
          break;

        case 'max':
          rules.push(Validators.max(v.value));
          break;

        case 'minLength':
          rules.push(Validators.minLength(v.value));
          break;

        case 'maxLength':
          rules.push(Validators.maxLength(v.value));
          break;

        case 'pattern':
          rules.push(Validators.pattern(v.value));
          break;

        case 'email':
          rules.push(Validators.email);
          break;
      }
    }

    return rules;
  }

  // ======================================================
  // SUBMIT
  // ======================================================

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('FORM VALUE', this.form.value);
  }
}
