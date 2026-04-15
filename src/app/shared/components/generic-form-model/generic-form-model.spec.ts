import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFormModel } from './generic-form-model';

describe('GenericFormModel', () => {
  let component: GenericFormModel;
  let fixture: ComponentFixture<GenericFormModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericFormModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericFormModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
