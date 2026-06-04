import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiHeader } from './ai-header';

describe('AiHeader', () => {
  let component: AiHeader;
  let fixture: ComponentFixture<AiHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
