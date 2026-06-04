import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingAssistant } from './hearing-assistant';

describe('HearingAssistant', () => {
  let component: HearingAssistant;
  let fixture: ComponentFixture<HearingAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingAssistant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HearingAssistant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
