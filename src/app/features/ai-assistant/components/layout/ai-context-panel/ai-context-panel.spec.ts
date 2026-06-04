import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiContextPanel } from './ai-context-panel';

describe('AiContextPanel', () => {
  let component: AiContextPanel;
  let fixture: ComponentFixture<AiContextPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiContextPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiContextPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
