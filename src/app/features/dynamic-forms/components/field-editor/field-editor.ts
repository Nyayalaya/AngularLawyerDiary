import { Component, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  FieldSchema,
  FIELD_TYPE_CONFIGS,
  FieldTypeConfig
} from '../../../../core/models/form-schema.model';

@Component({
  standalone: true,
  selector: 'app-field-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './field-editor.html'
})
export class FieldEditor implements OnInit {

  /* ---------------- INPUT ---------------- */
  field = input.required<FieldSchema>();

  /* ---------------- OUTPUT ---------------- */
  remove = output<void>();

  /* ---------------- STATE ---------------- */
  showAdvanced = signal(false);

  types: FieldTypeConfig[] = FIELD_TYPE_CONFIGS;

  /* ⭐ STRONGLY TYPED GROUPS (important fix) */
  groupedTypes: { key: string; value: FieldTypeConfig[] }[] = [];

  /* ---------------- INIT ---------------- */

  ngOnInit() {
    this.groupedTypes = this.groupByCategory(this.types);
  }

  /* ---------------- GROUP HELPER ---------------- */

  private groupByCategory(
    items: FieldTypeConfig[]
  ): { key: string; value: FieldTypeConfig[] }[] {

    const map = new Map<string, FieldTypeConfig[]>();

    for (const t of items) {
      if (!map.has(t.category)) {
        map.set(t.category, []);
      }
      map.get(t.category)!.push(t);
    }

    return Array.from(map.entries()).map(([key, value]) => ({
      key,
      value
    }));
  }

  /* ---------------- TYPE CHANGE ---------------- */

  onTypeChange(type: string) {
    const config = this.types.find(x => x.type === type);
    if (!config?.defaultConfig) return;

    Object.assign(this.field(), structuredClone(config.defaultConfig));
  }

  /* ---------------- VALIDATION ---------------- */

  isRequired() {
    return this.field().validations?.some(v => v.type === 'required');
  }

  toggleRequired(event: any) {
    const f = this.field();

    if (!f.validations) f.validations = [];

    if (event.target.checked) {
      f.validations.push({ type: 'required' });
    } else {
      f.validations = f.validations.filter(v => v.type !== 'required');
    }
  }

  /* ---------------- OPTIONS ---------------- */

  isOptionField(type: string) {
    return ['select','multiselect','radio','checkbox'].includes(type);
  }

  addOption() {
    if (!this.field().options) this.field().options = [];

    this.field().options?.push({
      label: 'Option',
      value: 'value'
    });
  }

  removeOption(i: number) {
    this.field().options?.splice(i, 1);
  }
}
