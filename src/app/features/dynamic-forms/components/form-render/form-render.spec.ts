import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRender } from './form-render';

describe('FormRender', () => {
  let component: FormRender;
  let fixture: ComponentFixture<FormRender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
