import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalSearch } from './legal-search';

describe('LegalSearch', () => {
  let component: LegalSearch;
  let fixture: ComponentFixture<LegalSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
