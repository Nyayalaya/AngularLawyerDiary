import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiMobileNav } from './ai-mobile-nav';

describe('AiMobileNav', () => {
  let component: AiMobileNav;
  let fixture: ComponentFixture<AiMobileNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiMobileNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiMobileNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
