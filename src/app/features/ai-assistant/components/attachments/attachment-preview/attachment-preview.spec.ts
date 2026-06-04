import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentPreview } from './attachment-preview';

describe('AttachmentPreview', () => {
  let component: AttachmentPreview;
  let fixture: ComponentFixture<AttachmentPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
