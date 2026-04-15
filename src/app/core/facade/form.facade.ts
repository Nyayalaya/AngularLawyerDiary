import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FormSchema } from "../models/form-schema.model";
import { FormService } from "../services/form.service";

@Injectable({ providedIn: 'root' })
export class DynamicFormFacade {

  forms$ = new BehaviorSubject<FormSchema[]>([]);
  activeForm$ = new BehaviorSubject<FormSchema | null>(null);

  constructor(private service: FormService) {}

  loadForms() {
    this.service.getForms().subscribe(x => this.forms$.next(x));
  }

  loadForm(id: string) {
    this.service.getForm(id).subscribe(x => this.activeForm$.next(x));
  }

  saveForm(schema: FormSchema) {
    return this.service.saveForm(schema);
  }

  submit(formId: string, data: any) {
    return this.service.submitForm(formId, data);
  }
}
