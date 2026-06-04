import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickPrompts } from './quick-prompts';

describe('QuickPrompts', () => {
  let component: QuickPrompts;
  let fixture: ComponentFixture<QuickPrompts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickPrompts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickPrompts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
