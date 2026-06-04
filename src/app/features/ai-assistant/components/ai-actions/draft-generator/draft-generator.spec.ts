import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftGenerator } from './draft-generator';

describe('DraftGenerator', () => {
  let component: DraftGenerator;
  let fixture: ComponentFixture<DraftGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftGenerator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftGenerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
