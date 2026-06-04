import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseContext } from './case-context';

describe('CaseContext', () => {
  let component: CaseContext;
  let fixture: ComponentFixture<CaseContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseContext]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseContext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
