import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationItem } from './conversation-item';

describe('ConversationItem', () => {
  let component: ConversationItem;
  let fixture: ComponentFixture<ConversationItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
