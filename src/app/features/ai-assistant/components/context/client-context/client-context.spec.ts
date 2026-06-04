import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientContext } from './client-context';

describe('ClientContext', () => {
  let component: ClientContext;
  let fixture: ComponentFixture<ClientContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientContext]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientContext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
