import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oplacalnosc } from './oplacalnosc';

describe('Oplacalnosc', () => {
  let component: Oplacalnosc;
  let fixture: ComponentFixture<Oplacalnosc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Oplacalnosc],
    }).compileComponents();

    fixture = TestBed.createComponent(Oplacalnosc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
