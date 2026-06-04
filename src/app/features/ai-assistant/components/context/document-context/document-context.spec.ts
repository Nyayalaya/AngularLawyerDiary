import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentContext } from './document-context';

describe('DocumentContext', () => {
  let component: DocumentContext;
  let fixture: ComponentFixture<DocumentContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentContext]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentContext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
