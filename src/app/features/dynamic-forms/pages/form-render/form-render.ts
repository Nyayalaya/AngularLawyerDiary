import { Component } from "@angular/core";
import { DynamicFormFacade } from "../../../../core/facade/form.facade";
import { FormSchema } from "../../../../core/models/form-schema.model";
import { ActivatedRoute } from "@angular/router";
import { FormRendererComponent } from "../../components/form-render/form-render";

@Component({
  standalone: true,
  imports: [FormRendererComponent],
  template: `<app-form-renderer
      *ngIf="schema"
      [schema]="schema">
    </app-form-renderer>
  `
})
export class FormRender {

  schema!: FormSchema;

  constructor(private facade: DynamicFormFacade,
              private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.facade.loadForm(id);

    this.facade.activeForm$.subscribe(x => this.schema = x!);
  }
}
