import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSidebar } from './ai-sidebar';

describe('AiSidebar', () => {
  let component: AiSidebar;
  let fixture: ComponentFixture<AiSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
