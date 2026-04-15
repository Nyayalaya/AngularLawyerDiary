import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCategory } from './master-category';

describe('MasterCategory', () => {
  let component: MasterCategory;
  let fixture: ComponentFixture<MasterCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
