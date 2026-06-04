import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentList } from './attachment-list';

describe('AttachmentList', () => {
  let component: AttachmentList;
  let fixture: ComponentFixture<AttachmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
