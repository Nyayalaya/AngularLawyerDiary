import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingContext } from './hearing-context';

describe('HearingContext', () => {
  let component: HearingContext;
  let fixture: ComponentFixture<HearingContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingContext]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HearingContext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
