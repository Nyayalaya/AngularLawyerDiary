import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormSchema } from "../models/form-schema.model";

@Injectable({ providedIn: 'root' })
export class FormService {

  constructor(private http: HttpClient) {}

  getForms() {
    return this.http.get<FormSchema[]>('/api/forms');
  }

  getForm(id: string) {
    return this.http.get<FormSchema>(`/api/forms/${id}`);
  }

  saveForm(schema: FormSchema) {
    return this.http.post('/api/forms', schema);
  }

  submitForm(formId: string, data: any) {
    return this.http.post(`/api/forms/${formId}/submit`, data);
  }
}
