import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineGenerator } from './timeline-generator';

describe('TimelineGenerator', () => {
  let component: TimelineGenerator;
  let fixture: ComponentFixture<TimelineGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineGenerator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineGenerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
