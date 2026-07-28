import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mailer } from './mailer';

describe('Mailer', () => {
  let component: Mailer;
  let fixture: ComponentFixture<Mailer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mailer],
    }).compileComponents();

    fixture = TestBed.createComponent(Mailer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
