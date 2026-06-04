import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationSearch } from './conversation-search';

describe('ConversationSearch', () => {
  let component: ConversationSearch;
  let fixture: ComponentFixture<ConversationSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
