import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionPrompts } from './suggestion-prompts';

describe('SuggestionPrompts', () => {
  let component: SuggestionPrompts;
  let fixture: ComponentFixture<SuggestionPrompts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionPrompts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestionPrompts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
