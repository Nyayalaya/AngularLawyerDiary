import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentItem } from './attachment-item';

describe('AttachmentItem', () => {
  let component: AttachmentItem;
  let fixture: ComponentFixture<AttachmentItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
