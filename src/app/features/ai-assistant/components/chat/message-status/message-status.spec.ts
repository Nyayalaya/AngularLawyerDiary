import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageStatus } from './message-status';

describe('MessageStatus', () => {
  let component: MessageStatus;
  let fixture: ComponentFixture<MessageStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
