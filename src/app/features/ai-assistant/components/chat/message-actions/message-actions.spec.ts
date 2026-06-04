import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageActions } from './message-actions';

describe('MessageActions', () => {
  let component: MessageActions;
  let fixture: ComponentFixture<MessageActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
